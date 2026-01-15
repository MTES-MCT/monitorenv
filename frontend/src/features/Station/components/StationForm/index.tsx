import { BackofficeWrapper, Title } from '@features/BackOffice/components/style'
import { addBackOfficeBanner } from '@features/BackOffice/useCases/addBackOfficeBanner'
import {
  Accent,
  Button,
  CoordinatesFormat,
  DataTable,
  FormikCoordinatesInput,
  FormikTextInput,
  Level
} from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { Formik } from 'formik'
import { useCallback, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import { INITIAL_STATION_FORM_VALUES, STATION_FORM_SCHEMA } from './constants'
import { getStationFormValuesFromStation, getStationDataFromStationFormValues, isStationData } from './utils'
import { stationsAPI, useGetStationQuery } from '../../../../api/stationsAPI'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { FrontendError } from '../../../../libs/FrontendError'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../../BackOffice/components/BackofficeMenu/constants'
import { CONTROL_UNIT_RESOURCE_TABLE_COLUMNS } from '../../../ControlUnit/components/ControlUnitForm/constants'

import type { StationFormValues } from './types'

export function StationForm() {
  const { stationId } = useParams()
  if (!stationId) {
    throw new FrontendError('`stationId` is undefined.')
  }

  const isNew = stationId === 'new'

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data: station } = useGetStationQuery(isNew ? skipToken : Number(stationId))

  const initialValues: StationFormValues | undefined = useMemo(() => {
    if (isNew) {
      return INITIAL_STATION_FORM_VALUES
    }

    return station ? getStationFormValuesFromStation(station) : undefined
  }, [station, isNew])

  const goBackToList = useCallback(() => {
    navigate(`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.STATION_LIST]}`)
  }, [navigate])

  const submit = useCallback(
    async (stationFormValues: StationFormValues) => {
      const stationData = getStationDataFromStationFormValues(stationFormValues)

      if (isNew) {
        await dispatch(stationsAPI.endpoints.createStation.initiate(stationData))
        dispatch(
          addBackOfficeBanner({
            children: `Base "${stationData.name}" créée.`,
            isClosable: true,
            isFixed: true,
            level: Level.SUCCESS,
            withAutomaticClosing: true
          })
        )

        goBackToList()

        return
      }

      if (!isStationData(stationData)) {
        throw new FrontendError('`stationData.id` is undefined.')
      }

      await dispatch(stationsAPI.endpoints.updateStation.initiate(stationData))
      dispatch(
        addBackOfficeBanner({
          children: `Base "${stationData.name}" mise à jour.`,
          isClosable: true,
          isFixed: true,
          level: Level.SUCCESS,
          withAutomaticClosing: true
        })
      )

      goBackToList()
    },
    [dispatch, goBackToList, isNew]
  )

  return (
    <BackofficeWrapper>
      <Title>{`${isNew ? 'Création' : 'Édition'} d’une base`}</Title>

      {!initialValues && <p>Chargement en cours...</p>}
      {initialValues && (
        <Formik initialValues={initialValues} onSubmit={submit} validationSchema={STATION_FORM_SCHEMA}>
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
            data={station?.controlUnitResources}
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
