import { DataTable, THEME } from '@mtes-mct/monitor-ui'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { FilterBar } from './FilterBar'
import { TabMenu } from './TabMenu'
import { getControlUnitTableColumns, getFilters } from './utils'
import {
  DELETE_CONTROL_UNIT_ERROR_MESSAGE,
  controlUnitsAPI,
  useGetControlUnitsQuery
} from '../../../../api/controlUnitsAPI'
import { ConfirmationModal } from '../../../../components/ConfirmationModal'
import { Dialog } from '../../../../components/Dialog'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { NavButton } from '../../../../ui/NavButton'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../../BackOfficeMenu/constants'

import type { ControlUnit } from '../../../../domain/entities/controlUnit'
import type { CellContext } from '@tanstack/react-table'

export function ControlUnitTable() {
  const [isArchivingConfirnationModalOpen, setIsArchivingConfirnationModalOpen] = useState(false)
  const [isDeletionConfirnationModalOpen, setIsDeletionConfirnationModalOpen] = useState(false)
  const [isImpossibleDeletionDialogOpen, setIsImpossibleDeletionDialogOpen] = useState(false)
  const [targettedControlUnit, setTargettedControlUnit] = useState<ControlUnit.ControlUnit | undefined>(undefined)

  const backOfficeControlUnitList = useAppSelector(store => store.backOfficeControlUnitList)
  const dispatch = useAppDispatch()
  const { data: controlUnits } = useGetControlUnitsQuery()

  const filteredControlUnits = useMemo(() => {
    if (!controlUnits) {
      return undefined
    }

    const filters = getFilters(controlUnits, backOfficeControlUnitList.filtersState)

    return filters.reduce((previousControlUnits, filter) => filter(previousControlUnits), controlUnits)
  }, [controlUnits, backOfficeControlUnitList.filtersState])

  const askForArchivingConfirmation = useCallback(async (cell: CellContext<ControlUnit.ControlUnit, unknown>) => {
    const controlUnit = cell.getValue<ControlUnit.ControlUnit>()

    setTargettedControlUnit(controlUnit)
    setIsArchivingConfirnationModalOpen(true)
  }, [])

  const askForDeletionConfirmation = useCallback(
    async (cell: CellContext<ControlUnit.ControlUnit, unknown>) => {
      const controlUnit = cell.getValue<ControlUnit.ControlUnit>()

      const { data: canDeleteControlUnit } = await dispatch(
        controlUnitsAPI.endpoints.canDeleteControlUnit.initiate(controlUnit.id)
      )
      if (!canDeleteControlUnit) {
        setIsImpossibleDeletionDialogOpen(true)

        return
      }

      setTargettedControlUnit(controlUnit)
      setIsDeletionConfirnationModalOpen(true)
    },
    [dispatch]
  )

  const close = useCallback(() => {
    setIsDeletionConfirnationModalOpen(false)
    setIsImpossibleDeletionDialogOpen(false)
    setTargettedControlUnit(undefined)
  }, [])

  const confirmArchiving = useCallback(
    async (controlUnitId: number) => {
      await dispatch(controlUnitsAPI.endpoints.archiveControlUnit.initiate(controlUnitId))

      close()
    },
    [close, dispatch]
  )

  const confirmDeletion = useCallback(
    async (controlUnitId: number) => {
      await dispatch(controlUnitsAPI.endpoints.deleteControlUnit.initiate(controlUnitId))

      close()
    },
    [close, dispatch]
  )

  const controlUnitTableColumns = useMemo(
    () =>
      getControlUnitTableColumns(
        askForArchivingConfirmation,
        askForDeletionConfirmation,
        backOfficeControlUnitList.filtersState.isArchived
      ),
    [backOfficeControlUnitList.filtersState.isArchived, askForArchivingConfirmation, askForDeletionConfirmation]
  )

  return (
    <>
      <Title>Administration des unités de contrôle</Title>

      <TabMenu />

      <FilterBar />

      <ActionGroup>
        <NavButton to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.CONTROL_UNIT_LIST]}/new`}>
          Nouvelle unité de contrôle
        </NavButton>
      </ActionGroup>

      <DataTable
        columns={controlUnitTableColumns}
        data={filteredControlUnits}
        initialSorting={[{ desc: false, id: 'name' }]}
      />

      {isArchivingConfirnationModalOpen && targettedControlUnit && (
        <ConfirmationModal
          confirmationButtonLabel="Archiver"
          message={[
            `Êtes-vous sûr de vouloir archiver l'unité "${targettedControlUnit.name}" ?`,
            `Elle n'apparaîtra plus dans MonitorEnv, elle ne sera plus utilisée que pour les statistiques.`
          ].join(' ')}
          onCancel={close}
          onConfirm={() => confirmArchiving(targettedControlUnit.id)}
          title="Archivage de l'unité"
        />
      )}

      {isDeletionConfirnationModalOpen && targettedControlUnit && (
        <ConfirmationModal
          confirmationButtonLabel="Supprimer"
          message={[
            `Êtes-vous sûr de vouloir supprimer l'unité "${targettedControlUnit.name}" ?`,
            `Ceci entraînera la suppression de toutes ses informations (moyens, contacts...).`
          ].join(' ')}
          onCancel={close}
          onConfirm={() => confirmDeletion(targettedControlUnit.id)}
          title="Suppression de l'unité"
        />
      )}

      {isImpossibleDeletionDialogOpen && (
        <Dialog
          color={THEME.color.maximumRed}
          message={DELETE_CONTROL_UNIT_ERROR_MESSAGE}
          onClose={close}
          title="Suppression impossible"
          titleBackgroundColor={THEME.color.maximumRed}
        />
      )}
    </>
  )
}

const Title = styled.h1`
  line-height: 1;
  font-size: 24px;
  margin: 0 0 24px;
`

const ActionGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`
