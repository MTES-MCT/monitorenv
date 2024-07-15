import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, IconButton, pluralize } from '@mtes-mct/monitor-ui'
import { archiveReportings } from 'domain/use_cases/reporting/archiveReportings'
import { deleteReportings } from 'domain/use_cases/reporting/deleteReportings'
import styled from 'styled-components'

export function GroupActions({ archiveOrDeleteReportingsCallback, reportingsIds, totalReportings }) {
  const dispatch = useAppDispatch()

  const archiveSeveralReportings = () => {
    dispatch(archiveReportings(reportingsIds, archiveOrDeleteReportingsCallback))
  }

  const deleteSeveralReportings = () => {
    dispatch(deleteReportings(reportingsIds, archiveOrDeleteReportingsCallback))
  }

  return (
    <StyledGroupActionContainer>
      <StyledButtonsContainer>
        <IconButton
          accent={Accent.SECONDARY}
          disabled={reportingsIds.length === 0}
          Icon={Icon.Archive}
          onClick={archiveSeveralReportings}
          title="Archiver"
        />
        <IconButton
          accent={Accent.SECONDARY}
          disabled={reportingsIds.length === 0}
          Icon={Icon.Delete}
          onClick={deleteSeveralReportings}
          title="Supprimer"
        />
      </StyledButtonsContainer>
      <NumberOfDisplayedReportings data-cy="totalReportings">
        {totalReportings} {pluralize('Signalement', totalReportings)}
      </NumberOfDisplayedReportings>
    </StyledGroupActionContainer>
  )
}

const StyledGroupActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
  margin-top: 40px;
  align-items: end;
  padding-right: 13px;
`
const StyledButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  align-self: end;
`
const NumberOfDisplayedReportings = styled.h3`
  font-size: 16px;
  line-height: 30px;
`
