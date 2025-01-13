import { TotalResults } from '@components/Table/style'
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
        <MissionsTable isFetching={isFetching} isLoading={isLoading} missions={missions} />
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
