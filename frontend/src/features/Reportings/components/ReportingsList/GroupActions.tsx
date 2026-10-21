import { TotalResults } from '@components/Table/style'
import { archiveReportings } from '@features/Reportings/useCases/archiveReportings'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, IconButton, pluralize } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function GroupActions({ archiveOrDeleteReportingsCallback, reportingsIds, totalReportings }) {
  const dispatch = useAppDispatch()

  const archiveSeveralReportings = () => {
    dispatch(archiveReportings(reportingsIds, archiveOrDeleteReportingsCallback))
  }

  return (
    <StyledGroupActionContainer>
      <StyledTotalResults data-cy="totalReportings">
        {totalReportings} {pluralize('Signalement', totalReportings)}
      </StyledTotalResults>
      <IconButton
        accent={Accent.SECONDARY}
        disabled={reportingsIds.length === 0}
        Icon={Icon.Archive}
        onClick={archiveSeveralReportings}
        title="Archiver"
      />
    </StyledGroupActionContainer>
  )
}

const StyledGroupActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
  margin-top: 32px;
  align-items: end;
`

const StyledTotalResults = styled(TotalResults)`
  margin-top: 0px;
`
