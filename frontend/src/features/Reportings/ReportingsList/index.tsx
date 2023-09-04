import { Button, Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ReportingsTable } from './ReportingsTable'
import { ReportingContext } from '../../../domain/shared_slices/ReportingState'
import { addReporting } from '../../../domain/use_cases/reportings/addReporting'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { ReportingsFilters } from '../Filters'
import { useGetFilteredReportingsQuery } from '../hooks/useGetFilteredReportingsQuery'

export function ReportingsList() {
  const dispatch = useAppDispatch()

  const { isError, isFetching, isLoading, reportings } = useGetFilteredReportingsQuery()

  const createReporting = () => {
    dispatch(addReporting(ReportingContext.SIDE_WINDOW, undefined))
  }

  return (
    <StyledReportingsContainer>
      <StyledHeader>
        <Title data-cy="SideWindowHeader-title">Signalements</Title>
        <StyledButton Icon={Icon.Plus} onClick={createReporting}>
          Ajouter un nouveau signalement
        </StyledButton>
      </StyledHeader>
      <ReportingsFilters />

      {isError ? (
        <p data-cy="listReportingWrapper">Erreur au chargement des données</p>
      ) : (
        <ReportingsTable isLoading={isLoading || isFetching} reportings={reportings} />
      )}
    </StyledReportingsContainer>
  )
}

const StyledReportingsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 40px;
  width: calc(100vw - 64px);
  overflow: auto;
`

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
  margin-bottom: 32px;
`

const Title = styled.h1`
  color: ${p => p.theme.color.gunMetal};
  font-size: 22px;
  line-height: 50px;
`

const StyledButton = styled(Button)`
  align-self: center;
`
