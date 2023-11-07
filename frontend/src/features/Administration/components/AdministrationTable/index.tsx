import { DataTable, THEME } from '@mtes-mct/monitor-ui'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { FilterBar } from './FilterBar'
import { TabMenu } from './TabMenu'
import { getAdministrationTableColumns, getFilters } from './utils'
import {
  ARCHIVE_ADMINISTRATION_ERROR_MESSAGE,
  DELETE_ADMINISTRATION_ERROR_MESSAGE,
  administrationsAPI,
  useGetAdministrationsQuery
} from '../../../../api/administrationsAPI'
import { ConfirmationModal } from '../../../../components/ConfirmationModal'
import { Dialog } from '../../../../components/Dialog'
import { globalActions } from '../../../../domain/shared_slices/Global'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { NavButton } from '../../../../ui/NavButton'
import { BACK_OFFICE_MENU_PATH, BackOfficeMenuKey } from '../../../BackOffice/components/BackofficeMenu/constants'

import type { Administration } from '../../../../domain/entities/administration'
import type { CellContext } from '@tanstack/react-table'

export function AdministrationTable() {
  const [isArchivingConfirmationModalOpen, setIsArchivingConfirmationModalOpen] = useState(false)
  const [isDeletionConfirmationModalOpen, setIsDeletionConfirmationModalOpen] = useState(false)
  const [isImpossibleArchivingDialogOpen, setIsImpossibleArchivingDialogOpen] = useState(false)
  const [isImpossibleDeletionDialogOpen, setIsImpossibleDeletionDialogOpen] = useState(false)
  const [targetedAdministration, setTargettedAdministration] = useState<Administration.Administration | undefined>(
    undefined
  )

  const backOfficeAdministrationList = useAppSelector(store => store.backOfficeAdministrationList)
  const dispatch = useAppDispatch()
  const { data: administrations } = useGetAdministrationsQuery()

  const filteredAdministrations = useMemo(() => {
    if (!administrations) {
      return undefined
    }

    const filters = getFilters(administrations, backOfficeAdministrationList.filtersState)

    return filters.reduce((previousAdministrations, filter) => filter(previousAdministrations), administrations)
  }, [backOfficeAdministrationList.filtersState, administrations])

  const askForArchivingConfirmation = useCallback(
    async (cellContext: CellContext<Administration.Administration, unknown>) => {
      const administration = cellContext.getValue<Administration.Administration>()

      const { data: canArchiveAdministration } = await dispatch(
        administrationsAPI.endpoints.canArchiveAdministration.initiate(administration.id)
      )
      if (!canArchiveAdministration) {
        setIsImpossibleArchivingDialogOpen(true)

        return
      }

      setTargettedAdministration(administration)
      setIsArchivingConfirmationModalOpen(true)
    },
    [dispatch]
  )

  const askForDeletionConfirmation = useCallback(
    async (cellContext: CellContext<Administration.Administration, unknown>) => {
      const administration = cellContext.getValue<Administration.Administration>()

      const { data: canDeleteAdministration } = await dispatch(
        administrationsAPI.endpoints.canDeleteAdministration.initiate(administration.id)
      )
      if (!canDeleteAdministration) {
        setIsImpossibleDeletionDialogOpen(true)

        return
      }

      setTargettedAdministration(administration)
      setIsDeletionConfirmationModalOpen(true)
    },
    [dispatch]
  )

  const close = useCallback(() => {
    setIsArchivingConfirmationModalOpen(false)
    setIsDeletionConfirmationModalOpen(false)
    setIsImpossibleArchivingDialogOpen(false)
    setIsImpossibleDeletionDialogOpen(false)
    setTargettedAdministration(undefined)
  }, [])

  const confirmArchiving = useCallback(
    async (administrationToArchive: Administration.Administration) => {
      await dispatch(administrationsAPI.endpoints.archiveAdministration.initiate(administrationToArchive.id))
      dispatch(
        globalActions.setToast({
          message: `Administration "${administrationToArchive.name}" archivée.`,
          type: 'success'
        })
      )

      close()
    },
    [close, dispatch]
  )

  const confirmDeletion = useCallback(
    async (administrationToDelete: Administration.Administration) => {
      await dispatch(administrationsAPI.endpoints.deleteAdministration.initiate(administrationToDelete.id))
      dispatch(
        globalActions.setToast({
          message: `Administration "${administrationToDelete.name}" supprimée.`,
          type: 'success'
        })
      )

      close()
    },
    [close, dispatch]
  )

  const administrationTableColumns = useMemo(
    () =>
      getAdministrationTableColumns(
        askForArchivingConfirmation,
        askForDeletionConfirmation,
        backOfficeAdministrationList.filtersState.isArchived
      ),
    [askForArchivingConfirmation, askForDeletionConfirmation, backOfficeAdministrationList.filtersState.isArchived]
  )

  return (
    <>
      <Title>Gestion des administrations</Title>

      <TabMenu />

      <FilterBar />

      <ActionGroup>
        <NavButton to={`/backoffice${BACK_OFFICE_MENU_PATH[BackOfficeMenuKey.ADMINISTRATION_LIST]}/new`}>
          Nouvelle administration
        </NavButton>
      </ActionGroup>

      <DataTable
        columns={administrationTableColumns}
        data={filteredAdministrations}
        initialSorting={[{ desc: false, id: 'name' }]}
      />

      {isArchivingConfirmationModalOpen && targetedAdministration && (
        <ConfirmationModal
          confirmationButtonLabel="Archiver"
          message={[
            `Êtes-vous sûr de vouloir archiver l'administration "${targetedAdministration.name}" ?`,
            `Elle n'apparaîtra plus dans MonitorFish et dans MonitorEnv, elle ne sera utilisée que pour les statistiques.`
          ].join(' ')}
          onCancel={close}
          onConfirm={() => confirmArchiving(targetedAdministration)}
          title="Archivage de l'administration"
        />
      )}

      {isDeletionConfirmationModalOpen && targetedAdministration && (
        <ConfirmationModal
          confirmationButtonLabel="Supprimer"
          message={`Êtes-vous sûr de vouloir supprimer l'administration "${targetedAdministration.name}" ?`}
          onCancel={close}
          onConfirm={() => confirmDeletion(targetedAdministration)}
          title="Suppression de l'administration"
        />
      )}

      {isImpossibleArchivingDialogOpen && (
        <Dialog
          color={THEME.color.maximumRed}
          message={ARCHIVE_ADMINISTRATION_ERROR_MESSAGE}
          onClose={close}
          title="Archivage impossible"
          titleBackgroundColor={THEME.color.maximumRed}
        />
      )}

      {isImpossibleDeletionDialogOpen && (
        <Dialog
          color={THEME.color.maximumRed}
          message={DELETE_ADMINISTRATION_ERROR_MESSAGE}
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
