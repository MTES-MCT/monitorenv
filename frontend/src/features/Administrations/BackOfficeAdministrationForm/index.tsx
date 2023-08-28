import { Accent, Button, FormikTextInput } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Formik } from 'formik'
import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import { ADMINISTRATION_FORM_SCHEMA, INITIAL_ADMINISTRATION_FORM_VALUES } from './constants'
import { administrationsAPI, useGetAdministrationQuery } from '../../../api/administrationsAPI'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { FrontendError } from '../../../libs/FrontendError'
import { DefaultTable } from '../../../ui/Table/DefaultTable'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../BackOfficeMenu/constants'
import { CONTROL_UNIT_TABLE_COLUMNS } from '../../ControlUnits/BackOfficeControlUnitList/constants'

import type { AdministrationFormValues } from './types'
import type { Administration } from '../../../domain/entities/administration'

export function BackOfficeAdministrationForm() {
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
    : administration || undefined

  const goBackToList = useCallback(() => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.ADMINISTRATION_LIST]}`)
  }, [navigate])

  const submit = useCallback(
    async (administrationFormValues: AdministrationFormValues) => {
      // Type-enforced by `ADMINISTRATION_FORM_SCHEMA`
      const administrationData = administrationFormValues as Administration.NewAdministrationData

      if (isNew) {
        await dispatch(administrationsAPI.endpoints.createAdministration.initiate(administrationData))

        goBackToList()

        return
      }

      await dispatch(
        administrationsAPI.endpoints.updateAdministration.initiate({
          id: Number(administrationId),
          ...administrationData
        })
      )

      goBackToList()
    },
    [administrationId, dispatch, goBackToList, isNew]
  )

  return (
    <div>
      <Title>{`${isNew ? 'Création' : 'Édition'} d’une administration`}</Title>

      {!getAdministrationQueryError && !initialValues && <p>Chargement en cours...</p>}

      {getAdministrationQueryError && <p>Cette administration n’existe pas ou plus.</p>}

      {!getAdministrationQueryError && initialValues && (
        <Formik initialValues={initialValues} onSubmit={submit} validationSchema={ADMINISTRATION_FORM_SCHEMA}>
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <FormikTextInput label="Nom" name="name" />

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

      <SubTitle>Unités de contrôle</SubTitle>
      <DefaultTable columns={CONTROL_UNIT_TABLE_COLUMNS as any} data={administration?.controlUnits} />
    </div>
  )
}

const Title = styled.h1`
  line-height: 1;
  font-size: 24px;
  margin: 0 0 24px;
`

const Form = styled.form`
  > div:not(:first-child) {
    margin-top: 16px;
  }
`

const ActionGroup = styled.div`
  margin-top: 24px !important;

  > button:not(:first-child) {
    margin-left: 16px;
  }
`

const SubTitle = styled.h2`
  line-height: 1;
  font-size: 18px;
  margin: 24px 0 24px;
`
