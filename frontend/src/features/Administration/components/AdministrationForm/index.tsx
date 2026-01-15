import { BackofficeWrapper, Title } from '@features/BackOffice/components/style'
import { addBackOfficeBanner } from '@features/BackOffice/useCases/addBackOfficeBanner'
import { Accent, Button, DataTable, FormikCheckbox, FormikTextInput, Level } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { Formik } from 'formik'
import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import { ADMINISTRATION_FORM_SCHEMA, CONTROL_UNIT_TABLE_COLUMNS, INITIAL_ADMINISTRATION_FORM_VALUES } from './constants'
import { administrationsAPI, useGetAdministrationQuery } from '../../../../api/administrationsAPI'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { FrontendError } from '../../../../libs/FrontendError'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../../BackOffice/components/BackofficeMenu/constants'

import type { AdministrationFormValues } from './types'
import type { Administration } from '../../../../domain/entities/administration'

export function AdministrationForm() {
  const { administrationId } = useParams()
  if (!administrationId) {
    throw new FrontendError('`administrationId` is undefined.')
  }

  const isNew = administrationId === 'new'

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data: administration, error: getAdministrationQueryError } = useGetAdministrationQuery(
    isNew ? skipToken : Number(administrationId)
  )

  const initialValues: AdministrationFormValues | undefined = isNew
    ? INITIAL_ADMINISTRATION_FORM_VALUES
    : administration ?? undefined

  const goBackToList = useCallback(() => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.ADMINISTRATION_LIST]}`)
  }, [navigate])

  const submit = useCallback(
    async (administrationFormValues: AdministrationFormValues) => {
      const administrationData = administrationFormValues as Administration.NewAdministrationData

      if (isNew) {
        await dispatch(administrationsAPI.endpoints.createAdministration.initiate(administrationData))
        dispatch(
          addBackOfficeBanner({
            children: `Administration "${administrationData.name}" créée.`,
            isClosable: true,
            isFixed: true,
            level: Level.SUCCESS,
            withAutomaticClosing: true
          })
        )

        goBackToList()

        return
      }

      await dispatch(
        administrationsAPI.endpoints.updateAdministration.initiate({
          id: Number(administrationId),
          ...administrationData
        })
      )
      dispatch(
        addBackOfficeBanner({
          children: `Administration "${administrationData.name}" mise à jour.`,
          isClosable: true,
          isFixed: true,
          level: Level.SUCCESS,
          withAutomaticClosing: true
        })
      )

      goBackToList()
    },
    [administrationId, dispatch, goBackToList, isNew]
  )

  return (
    <BackofficeWrapper>
      <Title>{`${isNew ? 'Création' : 'Édition'} d’une administration`}</Title>

      {!getAdministrationQueryError && !initialValues && <p>Chargement en cours...</p>}

      {getAdministrationQueryError && <p>Cette administration n’existe pas ou plus.</p>}

      {!getAdministrationQueryError && initialValues && (
        <Formik initialValues={initialValues} onSubmit={submit} validationSchema={ADMINISTRATION_FORM_SCHEMA}>
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <FormikTextInput label="Nom" name="name" />
              {/* This is a quick way to implement "unarchiving" for users in case of human error. */}
              {initialValues.isArchived && <FormikCheckbox label="Administration archivée" name="isArchived" />}

              <ActionGroup>
                <Button accent={Accent.SECONDARY} onClick={goBackToList}>
                  Annuler
                </Button>
                <Button type="submit">{isNew ? 'Créer' : 'Mettre à jour'}</Button>
              </ActionGroup>
            </Form>
          )}
        </Formik>
      )}

      <hr />

      {!isNew && (
        <>
          <SubTitle>Unités de contrôle</SubTitle>
          <DataTable
            columns={CONTROL_UNIT_TABLE_COLUMNS}
            data={administration?.controlUnits}
            initialSorting={[{ desc: false, id: 'name' }]}
          />
        </>
      )}
    </BackofficeWrapper>
  )
}

const Form = styled.form`
  > div:not(:first-child, :last-child) {
    margin-top: 16px;
  }
`

const ActionGroup = styled.div`
  margin-top: 24px;

  > button:not(:first-child) {
    margin-left: 16px;
  }
`

const SubTitle = styled.h2`
  line-height: 1;
  font-size: 18px;
  margin: 24px 0 24px;
`
