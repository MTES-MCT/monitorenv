import { ArchiveDialog } from '@components/Dialog/ArchiveDialog'
import { LocalizeCell } from '@components/Table/Cells/LocalizeCell'
import { archiveReporting } from '@features/Reportings/useCases/archiveReporting'
import { duplicateReporting } from '@features/Reportings/useCases/duplicateReporting'
import { editReportingInLocalStore } from '@features/Reportings/useCases/editReportingInLocalStore'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { ReportingContext } from 'domain/shared_slices/Global'
import { useState } from 'react'
import styled from 'styled-components'

export function ButtonsGroupRow({ geom, id }) {
  const dispatch = useAppDispatch()
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false)

  const edit = () => {
    dispatch(editReportingInLocalStore(id, ReportingContext.SIDE_WINDOW))
  }

  const duplicate = () => {
    dispatch(duplicateReporting(id))
  }

  const cancelArchiveReporting = () => {
    setIsArchiveModalOpen(false)
  }

  const confirmArchiveReporting = () => dispatch(archiveReporting(id))

  return (
    <>
      <ButtonsGroup>
        <li>
          <LocalizeCell geom={geom} />
        </li>
        <li>
          <IconButton
            accent={Accent.TERTIARY}
            data-cy={`duplicate-reporting-${id}`}
            Icon={Icon.Duplicate}
            onClick={duplicate}
            title="Dupliquer"
          />
        </li>
        <li>
          <IconButton
            accent={Accent.TERTIARY}
            data-cy={`edit-reporting-${id}`}
            Icon={Icon.Edit}
            onClick={edit}
            title="Editer"
          />
        </li>
        <li>
          <IconButton
            accent={Accent.TERTIARY}
            data-cy={`archive-reporting-${id}`}
            Icon={Icon.Archive}
            title="Archiver"
          />
        </li>
      </ButtonsGroup>
      {isArchiveModalOpen && (
        <ArchiveDialog
          context="reportings-table"
          isAbsolute={false}
          onCancel={cancelArchiveReporting}
          onConfirm={confirmArchiveReporting}
          subTitle="Voulez-vous enregistrer les modifications en cours et archiver le signalement&nbsp;?"
          title="Enregistrer et archiver le signalement&nbsp;?"
        />
      )}
    </>
  )
}

const ButtonsGroup = styled.ul`
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: space-evenly;

  > li {
    > div {
      > .rs-btn {
        padding-left: 0px !important;
      }
    }

    > button {
      padding: 0px;
    }
  }
`
