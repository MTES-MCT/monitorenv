import { addBackOfficeBanner } from '@features/BackOffice/useCases/addBackOfficeBanner'
import {
  Accent,
  Button,
  type ControlUnit,
  DataTable,
  FormikCheckbox,
  FormikSelect,
  FormikTextInput,
  getOptionsFromIdAndName,
  Level
} from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { Formik } from 'formik'
import { sortBy } from 'lodash/fp'
import { useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import {
  CONTROL_UNIT_FORM_SCHEMA,
  INITIAL_CONTROL_UNIT_FORM_VALUES,
  CONTROL_UNIT_CONTACT_TABLE_COLUMNS,
  CONTROL_UNIT_RESOURCE_TABLE_COLUMNS
} from './constants'
import { useGetAdministrationsQuery } from '../../../../api/administrationsAPI'
import { RTK_DEFAULT_QUERY_OPTIONS } from '../../../../api/constants'
import { controlUnitsAPI, useGetControlUnitQuery } from '../../../../api/controlUnitsAPI'
import { useGetDepartmentAreasQuery } from '../../../../api/departmentAreasAPI'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { FrontendError } from '../../../../libs/FrontendError'
import { isNotArchived } from '../../../../utils/isNotArchived'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../../BackOffice/components/BackofficeMenu/constants'

import type { ControlUnitFormValues } from './types'

export function ControlUnitForm() {
  const { controlUnitId } = useParams()
  if (!controlUnitId) {
    throw new FrontendError('`controlUnitId` is undefined.')
  }

  const isNew = controlUnitId === 'new'

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data: controlUnit, error } = useGetControlUnitQuery(
    isNew ? skipToken : Number(controlUnitId),
    RTK_DEFAULT_QUERY_OPTIONS
  )
  const { data: departmentAreas } = useGetDepartmentAreasQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const { data: administrations } = useGetAdministrationsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

  const initialValues: ControlUnitFormValues | undefined = isNew
    ? INITIAL_CONTROL_UNIT_FORM_VALUES
    : controlUnit ?? undefined

  const administrationsAsOptions = useMemo(
    () => getOptionsFromIdAndName(administrations?.filter(isNotArchived)),
    [administrations]
  )
  const departmentAreasAsOptions = useMemo(
    () =>
      departmentAreas
        ? sortBy(
            ['label'],
            departmentAreas.map(departmentArea => ({
              label: `${departmentArea.inseeCode} - ${departmentArea.name}`,
              value: departmentArea.inseeCode
            }))
          )
        : undefined,
    [departmentAreas]
  )

  const goBackToList = useCallback(() => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_LIST]}`)
  }, [navigate])

  const submit = useCallback(
    async (controlUnitFormValues: ControlUnitFormValues) => {
      const controlUnitData = controlUnitFormValues as ControlUnit.NewControlUnitData

      if (isNew) {
        await dispatch(controlUnitsAPI.endpoints.createControlUnit.initiate(controlUnitData))
        dispatch(
          addBackOfficeBanner({
            children: `Unité "${controlUnitData.name}" créée.`,
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
        controlUnitsAPI.endpoints.updateControlUnit.initiate({
          id: Number(controlUnitId),
          ...controlUnitData
        })
      )
      dispatch(
        addBackOfficeBanner({
          children: `Unité "${controlUnitData.name}" mise à jour.`,
          isClosable: true,
          isFixed: true,
          level: Level.SUCCESS,
          withAutomaticClosing: true
        })
      )

      goBackToList()
    },
    [controlUnitId, dispatch, goBackToList, isNew]
  )

  return (
    <div>
      <Title>{`${isNew ? 'Nouvelle' : 'Édition d’une'} unité de contrôle`}</Title>

      {!error && (!initialValues || !administrations) && <p>Chargement en cours...</p>}

      {error && <p>Cette unité de contrôle n’existe pas ou plus.</p>}

      {!error && initialValues && administrationsAsOptions && departmentAreasAsOptions && (
        <Formik initialValues={initialValues} onSubmit={submit} validationSchema={CONTROL_UNIT_FORM_SCHEMA}>
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <FormikSelect
                label="Administration"
                name="administrationId"
                options={administrationsAsOptions}
                searchable
              />
              <FormikTextInput label="Nom" name="name" />
              <FormikSelect
                label="Département"
                name="departmentAreaInseeCode"
                options={departmentAreasAsOptions}
                searchable
              />
              {/* This is a quick way to implement "unarchiving" for users in case of human error. */}
              {initialValues.isArchived && <FormikCheckbox label="Unité archivée" name="isArchived" />}

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
          <SubTitle>Contacts</SubTitle>
          <DataTable
            columns={CONTROL_UNIT_CONTACT_TABLE_COLUMNS}
            data={controlUnit?.controlUnitContacts}
            initialSorting={[{ desc: false, id: 'name' }]}
          />

          <hr />

          <SubTitle>Moyens</SubTitle>
          <DataTable
            columns={CONTROL_UNIT_RESOURCE_TABLE_COLUMNS}
            data={controlUnit?.controlUnitResources}
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
