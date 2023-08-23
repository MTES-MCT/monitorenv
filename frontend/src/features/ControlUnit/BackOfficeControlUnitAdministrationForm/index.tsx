import { Accent, Button, FormikTextInput } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Formik } from 'formik'
import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import { CONTROL_UNIT_ADMINISTRATION_FORM_SCHEMA, INITIAL_CONTROL_UNIT_ADMINISTRATION_FORM_VALUES } from './constants'
import {
  controlUnitAdministrationApi,
  useGetControlUnitAdministrationQuery
} from '../../../api/controlUnitAdministration'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { FrontendError } from '../../../libs/FrontendError'
import { DefaultTable } from '../../../ui/Table/DefaultTable'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../BackOfficeMenu/constants'
import { CONTROL_UNIT_TABLE_COLUMNS } from '../BackOfficeControlUnitList/constants'

import type { ControlUnitAdministrationFormValues } from './types'
import type { ControlUnit } from '../../../domain/entities/controlUnit/types'

export function BackOfficeControlUnitAdministrationForm() {
  const { controlUnitAdministrationId } = useParams()
  if (!controlUnitAdministrationId) {
    throw new FrontendError('`controlUnitAdministrationId` is undefined.')
  }

  const isNew = controlUnitAdministrationId === 'new'

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data: controlUnitAdministration, error: getControlUnitAdministrationQueryError } =
    useGetControlUnitAdministrationQuery(isNew ? skipToken : Number(controlUnitAdministrationId))

  const initialValues: ControlUnitAdministrationFormValues | undefined = isNew
    ? INITIAL_CONTROL_UNIT_ADMINISTRATION_FORM_VALUES
    : controlUnitAdministration || undefined

  const goBackToList = useCallback(() => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_ADMINISTRATION_LIST]}`)
  }, [navigate])

  const submit = useCallback(
    async (portFormValues: ControlUnitAdministrationFormValues) => {
      // Type-enforced by `CONTROL_UNIT_ADMINISTRATION_FORM_SCHEMA`
      const controlUnitAdministrationData = portFormValues as ControlUnit.NewControlUnitAdministrationData

      if (isNew) {
        await dispatch(
          controlUnitAdministrationApi.endpoints.createControlUnitAdministration.initiate(controlUnitAdministrationData)
        )

        goBackToList()

        return
      }

      await dispatch(
        controlUnitAdministrationApi.endpoints.updateControlUnitAdministration.initiate({
          id: Number(controlUnitAdministrationId),
          ...controlUnitAdministrationData
        })
      )

      goBackToList()
    },
    [controlUnitAdministrationId, dispatch, goBackToList, isNew]
  )

  return (
    <div>
      <Title>{`${isNew ? 'Création' : 'Édition'} d’une administration`}</Title>

      {!getControlUnitAdministrationQueryError && !initialValues && <p>Chargement en cours...</p>}

      {getControlUnitAdministrationQueryError && <p>Cette administration n’existe pas ou plus.</p>}

      {!getControlUnitAdministrationQueryError && initialValues && (
        <Formik
          initialValues={initialValues}
          onSubmit={submit}
          validationSchema={CONTROL_UNIT_ADMINISTRATION_FORM_SCHEMA}
        >
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
      <DefaultTable columns={CONTROL_UNIT_TABLE_COLUMNS as any} data={controlUnitAdministration?.controlUnits} />
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
