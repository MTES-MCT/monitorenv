import { ArchiveModal } from '@features/commonComponents/Modals/Archive'
import { DeleteModal } from '@features/commonComponents/Modals/Delete'
import { archiveReportingFromTable } from '@features/Reportings/useCases/archiveReporting'
import { deleteReporting } from '@features/Reportings/useCases/deleteReporting'
import { duplicateReporting } from '@features/Reportings/useCases/duplicateReporting'
import { editReportingInLocalStore } from '@features/Reportings/useCases/editReportingInLocalStore'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Dropdown, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { ReportingContext } from 'domain/shared_slices/Global'
import { useState } from 'react'
import styled from 'styled-components'

const ACTIONS = {
  ARCHIVE: 'ARCHIVE',
  DELETE: 'DELETE'
}

export function ButtonsGroupRow({ id }) {
  const dispatch = useAppDispatch()
  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)
  const isReportingFormDirty = useAppSelector(state =>
    activeReportingId ? state.reporting.reportings[activeReportingId]?.isFormDirty : false
  )

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)

  const edit = () => {
    dispatch(editReportingInLocalStore(id, ReportingContext.SIDE_WINDOW))
  }

  const duplicate = () => {
    dispatch(duplicateReporting(id))
  }

  const archiveOrDelete = action => {
    if (action === ACTIONS.ARCHIVE) {
      if (activeReportingId && id === activeReportingId && isReportingFormDirty) {
        return setIsArchiveModalOpen(true)
      }

      return dispatch(archiveReportingFromTable(id))
    }

    return setIsDeleteModalOpen(true)
  }

  const cancelDeleteReporting = () => {
    setIsDeleteModalOpen(false)
  }
  const confirmDeleteReporting = () => {
    dispatch(deleteReporting(id))
  }

  const cancelArchiveReporting = () => {
    setIsArchiveModalOpen(false)
  }

  const confirmArchiveReporting = () => dispatch(archiveReportingFromTable(id))

  return (
    <>
      <ButtonsGroup>
        <IconButton
          accent={Accent.TERTIARY}
          data-cy={`duplicate-reporting-${id}`}
          Icon={Icon.Duplicate}
          onClick={duplicate}
          title="Dupliquer"
        />
        <IconButton
          accent={Accent.TERTIARY}
          data-cy={`edit-reporting-${id}`}
          Icon={Icon.Edit}
          onClick={edit}
          title="Editer"
        />

        <Dropdown
          accent={Accent.TERTIARY}
          data-cy={`more-actions-reporting-${id}`}
          Icon={Icon.More}
          onSelect={archiveOrDelete}
        >
          <Dropdown.Item
            accent={Accent.SECONDARY}
            data-cy={`archive-reporting-${id}`}
            eventKey={ACTIONS.ARCHIVE}
            Icon={Icon.Archive}
            title="Archiver"
          />
          <Dropdown.Item
            accent={Accent.SECONDARY}
            data-cy={`delete-reporting-${id}`}
            eventKey={ACTIONS.DELETE}
            Icon={Icon.Delete}
            title="Supprimer"
          />
        </Dropdown>
      </ButtonsGroup>
      <DeleteModal
        cancelButtonText="Annuler"
        context="reportings-table"
        isAbsolute={false}
        onCancel={cancelDeleteReporting}
        onConfirm={confirmDeleteReporting}
        open={isDeleteModalOpen}
        subTitle="Êtes-vous sûr de vouloir supprimer le signalement&nbsp;?"
        title="Supprimer le signalement&nbsp;?"
      />
      <ArchiveModal
        context="reportings-table"
        isAbsolute={false}
        onCancel={cancelArchiveReporting}
        onConfirm={confirmArchiveReporting}
        open={isArchiveModalOpen}
        subTitle="Voulez-vous enregistrer les modifications en cours et archiver le signalement&nbsp;?"
        title="Enregistrer et archiver le signalement&nbsp;?"
      />
    </>
  )
}

const ButtonsGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: space-evenly;

  > div {
    > .rs-btn {
      padding-left: 0px !important;
    }
  }
  > button {
    padding: 0px;
  }
`
