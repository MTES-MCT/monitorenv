import { Button, Icon } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'
import { generatePath } from 'react-router'
import styled from 'styled-components'

import { MissionsTableFilters } from './Filters'
import { MissionsTable } from './MissionsTable'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { setSelectedMissionsIds } from '../../../domain/shared_slices/MultiMissionsState'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useGetFilteredMissionsQuery } from '../../../hooks/useGetFilteredMissionsQuery'
import { sideWindowActions } from '../../SideWindow/slice'

export function Missions() {
  const dispatch = useDispatch()

  const { selectedMissionsIds } = useAppSelector(state => state.multiMissionsState)

  const { isError, isFetching, isLoading, missions } = useGetFilteredMissionsQuery()

  const onAddMission = () => {
    dispatch(setSelectedMissionsIds({ id: selectedMissionsIds.length + 1, type: 'new' }))
    dispatch(
      sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.MISSION_NEW, { id: selectedMissionsIds.length + 1 }))
    )
  }

  return (
    <StyledMissionsContainer>
      <StyledHeader>
        <Title data-cy="SideWindowHeader-title">Missions et contrôles</Title>
        <StyledButton data-cy="add-mission" Icon={Icon.Plus} onClick={onAddMission}>
          Ajouter une nouvelle mission
        </StyledButton>
      </StyledHeader>
      <MissionsTableFilters />
      <NumberOfDisplayedMissions data-cy="Missions-numberOfDisplayedMissions">
        {missions?.length || '0'} Mission{missions && missions.length > 1 ? 's' : ''}
      </NumberOfDisplayedMissions>

      {isError ? (
        <p data-cy="listMissionWrapper">Erreur au chargement des données</p>
      ) : (
        <MissionsTable isLoading={isLoading || isFetching} missions={missions} />
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
