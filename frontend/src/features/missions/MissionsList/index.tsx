import { TotalResults } from '@components/Table/style'
import { SideWindowContent } from '@features/SideWindow/style'
import { Button, Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { MissionsTable } from './MissionsTable'
import { addMission } from '../../../domain/use_cases/missions/addMission'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useGetFilteredMissionsQuery } from '../../../hooks/useGetFilteredMissionsQuery'
import { MissionFilterContext, MissionFilters } from '../components/Filters'

export function Missions() {
  const dispatch = useAppDispatch()

  const { isError, isFetching, isLoading, missions } = useGetFilteredMissionsQuery()

  const createMission = () => {
    dispatch(addMission())
  }

  return (
    <SideWindowContent>
      <StyledHeader>
        <Title data-cy="SideWindowHeader-title">Missions et contrôles</Title>
        <StyledButton data-cy="add-mission" Icon={Icon.Plus} onClick={createMission}>
          Ajouter une nouvelle mission
        </StyledButton>
      </StyledHeader>
      <MissionFilters context={MissionFilterContext.TABLE} />
      <StyledTotalResults data-cy="Missions-numberOfDisplayedMissions">
        {missions?.length ?? '0'} Mission{missions && missions.length > 1 ? 's' : ''}
      </StyledTotalResults>

      {isError ? (
        <p data-cy="listMissionWrapper">Erreur au chargement des données</p>
      ) : (
        <MissionsTable isLoading={isLoading || isFetching} missions={missions} />
      )}
    </SideWindowContent>
  )
}

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

const StyledButton = styled(Button)`
  align-self: center;
`

const StyledTotalResults = styled(TotalResults)`
  margin-bottom: 8px;
`
