import { BackofficeWrapper, Title } from '@features/BackOffice/components/style'
import { addBackOfficeBanner } from '@features/BackOffice/useCases/addBackOfficeBanner'
import { DataTable, Level, THEME } from '@mtes-mct/monitor-ui'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { FilterBar } from './FilterBar'
import { getStationTableColumns, getFilters } from './utils'
import { RTK_DEFAULT_QUERY_OPTIONS } from '../../../../api/constants'
import { DELETE_STATION_ERROR_MESSAGE, stationsAPI, useGetStationsQuery } from '../../../../api/stationsAPI'
import { ConfirmationModal } from '../../../../components/ConfirmationModal'
import { Dialog } from '../../../../components/Dialog'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { NavButton } from '../../../../ui/NavButton'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../../BackOffice/components/BackofficeMenu/constants'

import type { Station } from '../../../../domain/entities/station'
import type { CellContext } from '@tanstack/react-table'

export function BaseTable() {
  const [isDeletionConfirmationModalOpen, setIsDeletionConfirmationModalOpen] = useState(false)
  const [isImpossibleDeletionDialogOpen, setIsImpossibleDeletionDialogOpen] = useState(false)
  const [targetedStation, setTargetedStation] = useState<Station.Station | undefined>(undefined)

  const stationTable = useAppSelector(store => store.stationTable)
  const dispatch = useAppDispatch()
  const { data: stations } = useGetStationsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

  const filteredStations = useMemo(() => {
    if (!stations) {
      return undefined
    }

    const filters = getFilters(stations, stationTable.filtersState)

    return filters.reduce((previousStations, filter) => filter(previousStations), stations)
  }, [stationTable.filtersState, stations])

  const askForDeletionConfirmation = useCallback(
    async (cellContext: CellContext<Station.Station, unknown>) => {
      const station = cellContext.getValue<Station.Station>()

      const { data: canDeleteStation } = await dispatch(stationsAPI.endpoints.canDeleteStation.initiate(station.id))
      if (!canDeleteStation) {
        setIsImpossibleDeletionDialogOpen(true)

        return
      }

      setTargetedStation(station)
      setIsDeletionConfirmationModalOpen(true)
    },
    [dispatch]
  )

  const close = useCallback(() => {
    setIsDeletionConfirmationModalOpen(false)
    setIsImpossibleDeletionDialogOpen(false)
  }, [])

  const confirmDeletion = useCallback(
    async (stationToDelete: Station.Station) => {
      await dispatch(stationsAPI.endpoints.deleteStation.initiate(stationToDelete.id))
      dispatch(
        addBackOfficeBanner({
          children: `Base "${stationToDelete.name}" supprimée.`,
          isClosable: true,
          isFixed: true,
          level: Level.SUCCESS,
          withAutomaticClosing: true
        })
      )

      close()
    },
    [close, dispatch]
  )

  const stationTableColumns = useMemo(
    () => getStationTableColumns(askForDeletionConfirmation),
    [askForDeletionConfirmation]
  )

  return (
    <BackofficeWrapper>
      <Title>Gestion des bases</Title>

      <FilterBar />

      <ActionGroup>
        <NavButton to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.STATION_LIST]}/new`}>
          Nouvelle base
        </NavButton>
      </ActionGroup>

      <DataTable columns={stationTableColumns} data={filteredStations} initialSorting={[{ desc: false, id: 'name' }]} />

      {isDeletionConfirmationModalOpen && targetedStation && (
        <ConfirmationModal
          confirmationButtonLabel="Supprimer"
          message={`Êtes-vous sûr de vouloir supprimer la base "${targetedStation.name}" ?`}
          onCancel={close}
          onConfirm={() => confirmDeletion(targetedStation)}
          title="Suppression de la base"
        />
      )}

      {isImpossibleDeletionDialogOpen && (
        <Dialog
          color={THEME.color.maximumRed}
          message={DELETE_STATION_ERROR_MESSAGE}
          onClose={close}
          title="Suppression impossible"
          titleBackgroundColor={THEME.color.maximumRed}
        />
      )}
    </BackofficeWrapper>
  )
}

const ActionGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`
