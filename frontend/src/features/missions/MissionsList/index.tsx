import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { sideWindowPaths } from '../../../domain/entities/sideWindow'
import { useGetFilteredMissionsQuery } from '../../../hooks/useGetFilteredMissionsQuery'
import { Header } from '../../SideWindow/Header'
import { sideWindowActions } from '../../SideWindow/slice'
import { MissionsTableFilters } from './Filters'
import { MissionsTable } from './MissionsTable'

export function Missions() {
  const dispatch = useDispatch()

  const { isError, isLoading, missions } = useGetFilteredMissionsQuery()

  return (
    <>
      <Header title="Missions et contrôles">
        <StyledButton
          accent={Accent.SECONDARY}
          data-cy="add-mission"
          Icon={Icon.Plus}
          onClick={() => dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.MISSION_NEW))}
        >
          Ajouter une nouvelle mission
        </StyledButton>
      </Header>
      <SideWindowContent>
        <MissionsTableFilters />
        <NumberOfDisplayedMissions data-cy="Missions-numberOfDisplayedMissions">
          {missions?.length || '0'} Mission{missions && missions.length > 1 ? 's' : ''}
        </NumberOfDisplayedMissions>
        <TableContainer>
          {isError ? (
            <p data-cy="listMissionWrapper">Erreur au chargement des données</p>
          ) : (
            <MissionsTable isLoading={isLoading} missions={missions} />
          )}
        </TableContainer>
      </SideWindowContent>
    </>
  )
}

const SideWindowContent = styled.div`
  margin: 8px;
  height: calc(100% - 50px - 16px);
  display: flex;
  flex-direction: column;
`

const NumberOfDisplayedMissions = styled.h3`
  font-size: 13px;
`
const StyledButton = styled(Button)`
  background-color: ${COLORS.white};
`
const TableContainer = styled.div`
  flex: 1;
`
