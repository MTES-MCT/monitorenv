import { Accent, Button, FormikTextInput } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Formik } from 'formik'
import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import { INITIAL_BASE_FORM_VALUES, BASE_FORM_SCHEMA } from './constants'
import { isBase } from './utils'
import { baseApi, useGetBaseQuery } from '../../../api/base'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { FrontendError } from '../../../libs/FrontendError'
import { DefaultTable } from '../../../ui/Table/DefaultTable'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../BackOfficeMenu/constants'
import { CONTROL_UNIT_RESOURCE_TABLE_COLUMNS } from '../../ControlUnit/BackOfficeControlUnitForm/constants'

import type { BaseFormValues } from './types'
import type { Base } from '../../../domain/entities/base/types'

export function BackOfficeBaseForm() {
  const { portId } = useParams()
  if (!portId) {
    throw new FrontendError('`portId` is undefined.')
  }

  const isNew = portId === 'new'

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data: port } = useGetBaseQuery(isNew ? skipToken : Number(portId))

  const initialValues: BaseFormValues | undefined = isNew ? INITIAL_BASE_FORM_VALUES : port || undefined

  const goBackToList = useCallback(() => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.BASE_LIST]}`)
  }, [navigate])

  const submit = useCallback(
    async (portFormValues: BaseFormValues) => {
      // Type-enforced by `PORT_FORM_SCHEMA`
      const portData = portFormValues as Base.BaseData

      if (isNew) {
        await dispatch(baseApi.endpoints.createBase.initiate(portData))

        goBackToList()

        return
      }

      if (!isBase(portData)) {
        throw new FrontendError('`portData.id` is undefined.')
      }

      await dispatch(baseApi.endpoints.updateBase.initiate(portData))

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

      <SubTitle>Moyens</SubTitle>
      <DefaultTable columns={CONTROL_UNIT_RESOURCE_TABLE_COLUMNS as any} data={port?.controlUnitResources} />
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
