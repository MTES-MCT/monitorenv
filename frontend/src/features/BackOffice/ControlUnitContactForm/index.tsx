import { Accent, Button, FormikSelect, FormikTextInput, FormikTextarea } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Formik } from 'formik'
import { sortBy } from 'lodash/fp'
import { useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import { CONTROL_UNIT_CONTACT_FORM_SCHEMA, INITIAL_CONTROL_UNIT_CONTACT_FORM_VALUES } from './constants'
import { useGetControlUnitsQuery } from '../../../api/controlUnit'
import { controlUnitContactApi, useGetControlUnitContactQuery } from '../../../api/controlUnitContact'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { FrontendError } from '../../../libs/FrontendError'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenu } from '../Menu/constants'

import type { ControlUnitContactFormValues } from './types'
import type { ControlUnit } from '../../../domain/entities/controlUnit/types'

export function ControlUnitContactForm() {
  const { controlUnitContactId } = useParams()
  if (!controlUnitContactId) {
    throw new FrontendError('`controlUnitContactId` is undefined.')
  }

  const isNew = controlUnitContactId === 'new'

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data: controlUnitContact, error: getControlUnitContactQueryError } = useGetControlUnitContactQuery(
    isNew ? skipToken : Number(controlUnitContactId)
  )
  const { data: controlUnits } = useGetControlUnitsQuery()

  const controlUnitsAsOptions = useMemo(
    () =>
      controlUnits
        ? sortBy(
            ['label'],
            controlUnits.map(({ controlUnitAdministration, id, name }) => ({
              label: `${controlUnitAdministration.name} > ${name}`,
              value: id
            }))
          )
        : undefined,
    [controlUnits]
  )

  const initialValues: ControlUnitContactFormValues | undefined = isNew
    ? INITIAL_CONTROL_UNIT_CONTACT_FORM_VALUES
    : controlUnitContact || undefined

  const goBackToList = useCallback(() => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenu.CONTROL_UNIT_CONTACT_LIST]}`)
  }, [navigate])

  const submit = useCallback(
    async (portFormValues: ControlUnitContactFormValues) => {
      // Type-enforced by `CONTROL_UNIT_CONTACT_FORM_SCHEMA`
      const controlUnitContactData = portFormValues as ControlUnit.NewControlUnitContactData

      if (isNew) {
        await dispatch(controlUnitContactApi.endpoints.createControlUnitContact.initiate(controlUnitContactData))

        goBackToList()

        return
      }

      await dispatch(
        controlUnitContactApi.endpoints.updateControlUnitContact.initiate({
          id: Number(controlUnitContactId),
          ...controlUnitContactData
        })
      )

      goBackToList()
    },
    [controlUnitContactId, dispatch, goBackToList, isNew]
  )

  return (
    <div>
      <Title>{`${isNew ? 'Création' : 'Édition'} d’un contact`}</Title>

      {!getControlUnitContactQueryError && !initialValues && <p>Chargement en cours...</p>}

      {getControlUnitContactQueryError && <p>Ce contact n’existe pas ou plus.</p>}

      {!getControlUnitContactQueryError && initialValues && controlUnitsAsOptions && (
        <Formik initialValues={initialValues} onSubmit={submit} validationSchema={CONTROL_UNIT_CONTACT_FORM_SCHEMA}>
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <FormikSelect label="Unité de contrôle" name="controlUnitId" options={controlUnitsAsOptions} searchable />
              <FormikTextInput label="Nom" name="name" />
              <FormikTextInput label="E-mail" name="email" />
              <FormikTextInput label="Téléphone" name="phone" />
              <FormikTextarea label="Note" name="note" />

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
