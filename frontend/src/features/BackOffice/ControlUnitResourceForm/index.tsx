import { Accent, Button, FormikSelect, FormikTextInput, FormikTextarea } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { Formik } from 'formik'
import { sortBy } from 'lodash/fp'
import { useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import { CONTROL_UNIT_RESOURCE_FORM_SCHEMA, INITIAL_CONTROL_UNIT_RESOURCE_FORM_VALUES } from './constants'
import { useGetControlUnitsQuery } from '../../../api/controlUnit'
import { controlUnitResourceApi, useGetControlUnitResourceQuery } from '../../../api/controlUnitResource'
import { useGetPortsQuery } from '../../../api/port'
import { ControlUnit } from '../../../domain/entities/controlUnit/types'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { FrontendError } from '../../../libs/FrontendError'
import { getOptionsFromIdAndName } from '../../../utils/getOptionsFromIdAndName'
import { getOptionsFromLabelledEnum } from '../../../utils/getOptionsFromLabelledEnum'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenu } from '../Menu/constants'

import type { ControlUnitResourceFormValues } from './types'

export function ControlUnitResourceForm() {
  const { controlUnitResourceId } = useParams()
  if (!controlUnitResourceId) {
    throw new FrontendError('`controlUnitResourceId` is undefined.')
  }

  const isNew = controlUnitResourceId === 'new'

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data: controlUnitResource, error: getControlUnitResourceQueryError } = useGetControlUnitResourceQuery(
    isNew ? skipToken : Number(controlUnitResourceId)
  )
  const { data: controlUnits } = useGetControlUnitsQuery()
  const { data: ports } = useGetPortsQuery()

  const initialValues: ControlUnitResourceFormValues | undefined = isNew
    ? INITIAL_CONTROL_UNIT_RESOURCE_FORM_VALUES
    : controlUnitResource || undefined

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

  const portsAsOptions = useMemo(() => getOptionsFromIdAndName(ports), [ports])

  const typesAsOptions = useMemo(() => getOptionsFromLabelledEnum(ControlUnit.ControlUnitResourceType), [])

  const goBackToList = useCallback(() => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenu.CONTROL_UNIT_RESOURCE_LIST]}`)
  }, [navigate])

  const submit = useCallback(
    async (portFormValues: ControlUnitResourceFormValues) => {
      // Type-enforced by `CONTROL_UNIT_RESOURCE_FORM_SCHEMA`
      const controlUnitResourceData = portFormValues as ControlUnit.NewControlUnitResourceData

      if (isNew) {
        await dispatch(controlUnitResourceApi.endpoints.createControlUnitResource.initiate(controlUnitResourceData))

        goBackToList()

        return
      }

      await dispatch(
        controlUnitResourceApi.endpoints.updateControlUnitResource.initiate({
          id: Number(controlUnitResourceId),
          ...controlUnitResourceData
        })
      )

      goBackToList()
    },
    [controlUnitResourceId, dispatch, goBackToList, isNew]
  )

  return (
    <div>
      <Title>{`${isNew ? 'Création' : 'Édition'} d’un moyen`}</Title>

      {!getControlUnitResourceQueryError && !initialValues && <p>Chargement en cours...</p>}

      {getControlUnitResourceQueryError && <p>Ce moyen n’existe pas ou plus.</p>}

      {!getControlUnitResourceQueryError && initialValues && controlUnitsAsOptions && portsAsOptions && (
        <Formik initialValues={initialValues} onSubmit={submit} validationSchema={CONTROL_UNIT_RESOURCE_FORM_SCHEMA}>
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <FormikSelect label="Unité de contrôle" name="controlUnitId" options={controlUnitsAsOptions} searchable />
              <FormikTextInput label="Nom" name="name" />
              <FormikSelect label="Type" name="type" options={typesAsOptions} searchable />
              <FormikSelect label="Port" name="portId" options={portsAsOptions} searchable />
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
