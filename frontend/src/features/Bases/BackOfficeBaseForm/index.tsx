import { Accent, Button, DataTable, FormikTextInput } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Formik } from 'formik'
import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import { INITIAL_BASE_FORM_VALUES, BASE_FORM_SCHEMA } from './constants'
import { isBase } from './utils'
import { basesAPI, useGetBaseQuery } from '../../../api/basesAPI'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { FrontendError } from '../../../libs/FrontendError'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../BackOfficeMenu/constants'
import { CONTROL_UNIT_RESOURCE_TABLE_COLUMNS } from '../../ControlUnits/BackOfficeControlUnitForm/constants'

import type { BaseFormValues } from './types'
import type { Base } from '../../../domain/entities/base'

export function BackOfficeBaseForm() {
  const { baseId } = useParams()
  if (!baseId) {
    throw new FrontendError('`baseId` is undefined.')
  }

  const isNew = baseId === 'new'

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data: base } = useGetBaseQuery(isNew ? skipToken : Number(baseId))

  const initialValues: BaseFormValues | undefined = isNew ? INITIAL_BASE_FORM_VALUES : base || undefined

  const goBackToList = useCallback(() => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.BASE_LIST]}`)
  }, [navigate])

  const submit = useCallback(
    async (baseFormValues: BaseFormValues) => {
      // Type-enforced by `BASE_FORM_SCHEMA`
      const baseData = baseFormValues as Base.BaseData

      if (isNew) {
        await dispatch(basesAPI.endpoints.createBase.initiate(baseData))

        goBackToList()

        return
      }

      if (!isBase(baseData)) {
        throw new FrontendError('`baseData.id` is undefined.')
      }

      await dispatch(basesAPI.endpoints.updateBase.initiate(baseData))

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
              {/* TODO Use `FormikCoordinatesInput` here after fixing `FormikCoordinatesInput.type` typing error in MUI including it in `cy.fill()` command. */}
              <FormikTextInput label="Latitude" name="latitude" />
              <FormikTextInput label="Longitude" name="longitude" />

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
