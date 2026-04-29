import { Header, Title, TotalResults } from '@components/Table/style'
import { MissionFilterContext, MissionFilters } from '@features/Mission/components/Filters'
import { useGetFilteredMissionsQuery } from '@features/Mission/hooks/useGetFilteredMissionsQuery'
import { addMission } from '@features/Mission/useCases/addMission'
import { SideWindowContent } from '@features/SideWindow/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Button, Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { MissionsTable } from './MissionsTable'

export function Missions() {
  const dispatch = useAppDispatch()

  const { isError, isFetching, isLoading, missions } = useGetFilteredMissionsQuery()

  const createMission = () => {
    dispatch(addMission())
  }

  return (
    <SideWindowContent>
      <Header>
        <Title data-cy="SideWindowHeader-title">Missions et contrôles</Title>
        <StyledButton data-cy="add-mission" Icon={Icon.Plus} onClick={createMission}>
          Ajouter une nouvelle mission
        </StyledButton>
      </Header>
      <MissionFilters context={MissionFilterContext.TABLE} />
      <StyledTotalResults data-cy="Missions-numberOfDisplayedMissions">
        {missions?.length ?? '0'} Mission{missions && missions.length > 1 ? 's' : ''}
      </StyledTotalResults>

      {isError ? (
        <p data-cy="listMissionWrapper">Erreur au chargement des données</p>
      ) : (
        <MissionsTable isFetching={isFetching} isLoading={isLoading} missions={missions} />
      )}
    </SideWindowContent>
  )
}

const StyledButton = styled(Button)`
  align-self: center;
`

const StyledTotalResults = styled(TotalResults)`
  margin-bottom: 8px;
`
