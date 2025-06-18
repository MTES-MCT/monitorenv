import { addBackOfficeBanner } from '@features/BackOffice/useCases/addBackOfficeBanner'
import { type ControlUnit, DataTable, Level, THEME } from '@mtes-mct/monitor-ui'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { FilterBar } from './FilterBar'
import { TabMenu } from './TabMenu'
import { getControlUnitTableColumns, getFilters } from './utils'
import { RTK_DEFAULT_QUERY_OPTIONS } from '../../../../api/constants'
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
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../../BackOffice/components/BackofficeMenu/constants'

import type { CellContext } from '@tanstack/react-table'

export function ControlUnitTable() {
  const [isArchivingConfirmationModalOpen, setIsArchivingConfirmationModalOpen] = useState(false)
  const [isDeletionConfirmationModalOpen, setIsDeletionConfirmationModalOpen] = useState(false)
  const [isImpossibleDeletionDialogOpen, setIsImpossibleDeletionDialogOpen] = useState(false)
  const [targetedControlUnit, setTargetedControlUnit] = useState<ControlUnit.ControlUnit | undefined>(undefined)

  const controlUnitTable = useAppSelector(store => store.controlUnitTable)
  const dispatch = useAppDispatch()
  const { data: controlUnits } = useGetControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

  const filteredControlUnits = useMemo(() => {
    if (!controlUnits) {
      return undefined
    }

    const filters = getFilters(controlUnits, controlUnitTable.filtersState)

    return filters.reduce((previousControlUnits, filter) => filter(previousControlUnits), controlUnits)
  }, [controlUnits, controlUnitTable.filtersState])

  const askForArchivingConfirmation = useCallback(
    async (cellContext: CellContext<ControlUnit.ControlUnit, unknown>) => {
      const controlUnit = cellContext.getValue<ControlUnit.ControlUnit>()

      setTargetedControlUnit(controlUnit)
      setIsArchivingConfirmationModalOpen(true)
    },
    []
  )

  const askForDeletionConfirmation = useCallback(
    async (cellContext: CellContext<ControlUnit.ControlUnit, unknown>) => {
      const controlUnit = cellContext.getValue<ControlUnit.ControlUnit>()

      const { data: canDeleteControlUnit } = await dispatch(
        controlUnitsAPI.endpoints.canDeleteControlUnit.initiate(controlUnit.id)
      )
      if (!canDeleteControlUnit) {
        setIsImpossibleDeletionDialogOpen(true)

        return
      }

      setTargetedControlUnit(controlUnit)
      setIsDeletionConfirmationModalOpen(true)
    },
    [dispatch]
  )

  const close = useCallback(() => {
    setIsArchivingConfirmationModalOpen(false)
    setIsDeletionConfirmationModalOpen(false)
    setIsImpossibleDeletionDialogOpen(false)
    setTargetedControlUnit(undefined)
  }, [])

  const confirmArchiving = useCallback(
    async (controlUnitToArchive: ControlUnit.ControlUnit) => {
      await dispatch(controlUnitsAPI.endpoints.archiveControlUnit.initiate(controlUnitToArchive.id))
      dispatch(
        addBackOfficeBanner({
          children: `Unité "${controlUnitToArchive.name}" archivée.`,
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

  const confirmDeletion = useCallback(
    async (controlUnitToDelete: ControlUnit.ControlUnit) => {
      await dispatch(controlUnitsAPI.endpoints.deleteControlUnit.initiate(controlUnitToDelete.id))
      dispatch(
        addBackOfficeBanner({
          children: `Unité "${controlUnitToDelete.name}" supprimée.`,
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

  const controlUnitTableColumns = useMemo(
    () =>
      getControlUnitTableColumns(
        askForArchivingConfirmation,
        askForDeletionConfirmation,
        controlUnitTable.filtersState.isArchived
      ),
    [askForArchivingConfirmation, askForDeletionConfirmation, controlUnitTable.filtersState.isArchived]
  )

  return (
    <>
      <Title>Gestion des unités de contrôle</Title>

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

      {isArchivingConfirmationModalOpen && targetedControlUnit && (
        <ConfirmationModal
          confirmationButtonLabel="Archiver"
          message={[
            `Êtes-vous sûr de vouloir archiver l'unité "${targetedControlUnit.name}" ?`,
            `Elle n'apparaîtra plus dans MonitorFish et dans MonitorEnv, elle ne sera plus utilisée pour les statistiques.`
          ].join(' ')}
          onCancel={close}
          onConfirm={() => confirmArchiving(targetedControlUnit)}
          title="Archivage de l'unité"
        />
      )}

      {isDeletionConfirmationModalOpen && targetedControlUnit && (
        <ConfirmationModal
          confirmationButtonLabel="Supprimer"
          message={[
            `Êtes-vous sûr de vouloir supprimer l'unité "${targetedControlUnit.name}" ?`,
            `Ceci entraînera la suppression de toutes ses informations (moyens, contacts...).`
          ].join(' ')}
          onCancel={close}
          onConfirm={() => confirmDeletion(targetedControlUnit)}
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
