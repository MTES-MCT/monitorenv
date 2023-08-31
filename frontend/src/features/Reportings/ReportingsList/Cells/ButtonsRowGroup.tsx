import { Accent, Dropdown, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

import { ReportingContext } from '../../../../domain/shared_slices/ReportingState'
import { archiveReportingFromTable } from '../../../../domain/use_cases/reportings/archiveReporting'
import { deleteReporting } from '../../../../domain/use_cases/reportings/deleteReporting'
import { duplicateReporting } from '../../../../domain/use_cases/reportings/duplicateReporting'
import { editReportingInLocalStore } from '../../../../domain/use_cases/reportings/editReportingInLocalStore'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { ArchiveModal } from '../../../commonComponents/Modals/Archive'
import { DeleteModal } from '../../../commonComponents/Modals/Delete'

const ACTIONS = {
  ARCHIVE: 'ARCHIVE',
  DELETE: 'DELETE'
}

export function ButtonsGroupRow({ id }) {
  const dispatch = useAppDispatch()
  const {
    reportingState: { isFormDirty, selectedReportingId }
  } = useAppSelector(state => state)
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
      if (id === selectedReportingId && isFormDirty) {
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
        <IconButton accent={Accent.TERTIARY} Icon={Icon.Duplicate} onClick={duplicate} title="Dupliquer" />
        <IconButton accent={Accent.TERTIARY} Icon={Icon.Edit} onClick={edit} title="Editer" />

        <StyledDropdown
          accent={Accent.SECONDARY}
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
        </StyledDropdown>
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
        subTitle="Voulez-vous enregister les modifications en cours et archiver le signalement&nbsp;?"
        title="Enregister et archiver le signalement&nbsp;?"
      />
    </>
  )
}

const ButtonsGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: space-evenly;
  > button {
    padding: 0px;
  }
`

// TODO do this in monitor-ui
const StyledDropdown = styled(Dropdown)`
  svg.rs-dropdown-item-menu-icon {
    vertical-align: middle;
    margin-right: 0px;
  }
  .rs-dropdown-item {
    line-height: 20px;
  }
`
