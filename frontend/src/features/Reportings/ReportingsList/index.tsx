import { Button, Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ReportingsTable } from './ReportingsTable'
import { addReporting } from '../../../domain/use_cases/reportings/addReporting'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useGetFilteredReportingsQuery } from '../../../hooks/useGetFilteredReportingsQuery'

export function ReportingsList() {
  const dispatch = useAppDispatch()

  const { isError, isFetching, isLoading, reportings } = useGetFilteredReportingsQuery()

  const createReporting = () => {
    dispatch(addReporting())
  }

  return (
    <StyledMissionsContainer>
      <StyledHeader>
        <Title data-cy="SideWindowHeader-title">Signalements</Title>
        <StyledButton data-cy="add-mission" Icon={Icon.Plus} onClick={createReporting}>
          Ajouter un nouveau signalement
        </StyledButton>
      </StyledHeader>
      {/* <MissionsTableFilters /> */}
      <NumberOfDisplayedMissions data-cy="Missions-numberOfDisplayedMissions">
        {reportings?.length || '0'} Signalement{reportings && reportings.length > 1 ? 's' : ''}
      </NumberOfDisplayedMissions>

      {isError ? (
        <p data-cy="listMissionWrapper">Erreur au chargement des données</p>
      ) : (
        <ReportingsTable isLoading={isLoading || isFetching} reportings={reportings} />
      )}
    </StyledMissionsContainer>
  )
}

const StyledMissionsContainer = styled.div`
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
  margin-bottom: 40px;
`

const Title = styled.h1`
  color: ${p => p.theme.color.gunMetal};
  font-size: 22px;
  line-height: 50px;
`

const NumberOfDisplayedMissions = styled.h3`
  font-size: 13px;
  margin-top 32px;
`
const StyledButton = styled(Button)`
  align-self: center;
`
