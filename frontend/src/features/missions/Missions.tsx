import { useDispatch } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../constants/constants'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { useGetFilteredMissionsQuery } from '../../hooks/useGetFilteredMissionsQuery'
import { ReactComponent as PlusSVG } from '../../uiMonitor/icons/Plus.svg'
import { Header } from '../SideWindow/Header'
import { sideWindowActions } from '../SideWindow/slice'
import { MissionsTable } from './MissionsList/MissionsTable'
import { MissionsTableFilters } from './MissionsList/MissionsTableFilters'

export function Missions() {
  const dispatch = useDispatch()

  const { isError, isLoading, missions } = useGetFilteredMissionsQuery()

  return (
    <>
      <Header title="Missions et contrôles">
        <AddNewMissionButton
          data-cy="add-mission"
          icon={<PlusSVG className="rs-icon" />}
          onClick={() => dispatch(sideWindowActions.openAndGoTo(sideWindowPaths.MISSION_NEW))}
        >
          <span>Ajouter une nouvelle mission</span>
        </AddNewMissionButton>
      </Header>
      <SideWindowContent>
        <MissionsTableFilters />
        <NumberOfDisplayedMissions data-cy="Missions-numberOfDisplayedMissions">
          {missions?.length || '0'} Mission{missions && missions.length > 1 ? 's' : ''}
        </NumberOfDisplayedMissions>
        {isError ? (
          <ErrorMessage data-cy="listMissionWrapper">Erreur au chargement des données</ErrorMessage>
        ) : (
          <MissionsTable isLoading={isLoading} missions={missions} />
        )}
      </SideWindowContent>
    </>
  )
}

const ErrorMessage = styled.div``

const SideWindowContent = styled.div`
  padding: 8px;
  height: calc(100% - 50px);
`

const NumberOfDisplayedMissions = styled.h3`
  font-size: 13px;
`
const AddNewMissionButton = styled(IconButton)`
  background: ${COLORS.white};
`
