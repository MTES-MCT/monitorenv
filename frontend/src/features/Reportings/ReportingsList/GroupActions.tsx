import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { archiveMultipleReportings } from '../../../domain/use_cases/reportings/archiveMultipleReportings'
import { deleteMultipleReportings } from '../../../domain/use_cases/reportings/deleteMultipleReportings'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { pluralize } from '../../../utils/pluralize'

export function GroupActions({ archiveOrDeleteReportingsCallback, reportingsIds, totalReportings }) {
  const dispatch = useAppDispatch()

  const archiveReportings = () => {
    dispatch(archiveMultipleReportings(reportingsIds, archiveOrDeleteReportingsCallback))
  }

  const deleteReportings = () => {
    dispatch(deleteMultipleReportings(reportingsIds, archiveOrDeleteReportingsCallback))
  }

  return (
    <StyledGroupActionContainer>
      <StyledButtonsContainer>
        <IconButton
          accent={Accent.SECONDARY}
          disabled={reportingsIds.length === 0}
          Icon={Icon.Archive}
          onClick={archiveReportings}
          title="Archiver"
        />
        <IconButton
          accent={Accent.SECONDARY}
          disabled={reportingsIds.length === 0}
          Icon={Icon.Delete}
          onClick={deleteReportings}
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
