import {
  Accent,
  Button,
  CoordinatesFormat,
  DataTable,
  FormikCoordinatesInput,
  FormikTextInput
} from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Formik } from 'formik'
import { useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import { INITIAL_BASE_FORM_VALUES, BASE_FORM_SCHEMA } from './constants'
import { getBaseFormValuesFromBase, getBaseDataFromBaseFormValues, isBase } from './utils'
import { basesAPI, useGetBaseQuery } from '../../../../api/basesAPI'
import { globalActions } from '../../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { FrontendError } from '../../../../libs/FrontendError'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../../BackOffice/components/BackofficeMenu/constants'
import { CONTROL_UNIT_RESOURCE_TABLE_COLUMNS } from '../../../ControlUnit/components/ControlUnitForm/constants'

import type { BaseFormValues } from './types'

export function BaseForm() {
  const { baseId } = useParams()
  if (!baseId) {
    throw new FrontendError('`baseId` is undefined.')
  }

  const isNew = baseId === 'new'

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data: base } = useGetBaseQuery(isNew ? skipToken : Number(baseId))

  const initialValues: BaseFormValues | undefined = useMemo(() => {
    if (isNew) {
      return INITIAL_BASE_FORM_VALUES
    }

    return base ? getBaseFormValuesFromBase(base) : undefined
  }, [base, isNew])

  const goBackToList = useCallback(() => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.BASE_LIST]}`)
  }, [navigate])

  const submit = useCallback(
    async (baseFormValues: BaseFormValues) => {
      const baseData = getBaseDataFromBaseFormValues(baseFormValues)

      if (isNew) {
        await dispatch(basesAPI.endpoints.createBase.initiate(baseData))
        dispatch(
          globalActions.setToast({
            message: `Base "${baseData.name}" créée.`,
            type: 'success'
          })
        )

        goBackToList()

        return
      }

      if (!isBase(baseData)) {
        throw new FrontendError('`baseData.id` is undefined.')
      }

      await dispatch(basesAPI.endpoints.updateBase.initiate(baseData))
      dispatch(
        globalActions.setToast({
          message: `Base "${baseData.name}" mise à jour.`,
          type: 'success'
        })
      )

      goBackToList()
    },
    [dispatch, goBackToList, isNew]
  )

  return (
    <div>
      <Title>{`${isNew ? 'Création' : 'Édition'} d’une base`}</Title>

      {!initialValues && <p>Chargement en cours...</p>}
      {initialValues && (
        <Formik initialValues={initialValues} onSubmit={submit} validationSchema={BASE_FORM_SCHEMA}>
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <FormikTextInput label="Nom" name="name" />
              <FormikCoordinatesInput
                coordinatesFormat={CoordinatesFormat.DECIMAL_DEGREES}
                label="Coordonnées"
                name="coordinates"
                style={{ marginTop: 16 }}
              />

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
          <SubTitle>Moyens</SubTitle>
          <DataTable
            columns={CONTROL_UNIT_RESOURCE_TABLE_COLUMNS}
            data={base?.controlUnitResources}
            initialSorting={[{ desc: false, id: 'name' }]}
          />
        </>
      )}
    </div>
  )
}

const Title = styled.h1`
  line-height: 1;
  font-size: 24px;
  margin: 0 0 24px;
`

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
