import { useDispatch } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { setSideWindowPath } from '../../components/SideWindowRouter/SideWindowRouter.slice'
import { COLORS } from '../../constants/constants'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { useGetFilteredMissionsQuery } from '../../hooks/useGetFilteredMissionsQuery'
import { ReactComponent as PlusSVG } from '../../uiMonitor/icons/Plus.svg'
import { SideWindowHeader } from '../side_window/SideWindowHeader'
import { MissionsTable } from './MissionsList/MissionsTable'
import { MissionsTableFilters } from './MissionsList/MissionsTableFilters'

export function Missions() {
  const dispatch = useDispatch()

  const { data, isError, isLoading } = useGetFilteredMissionsQuery()

  return (
    <SideWindowWrapper data-cy="listMissionWrapper">
      <>
        <SideWindowHeader title="Missions et contrôles">
          <AddNewMissionButton
            icon={<PlusSVG className="rs-icon" />}
            onClick={() => dispatch(setSideWindowPath(sideWindowPaths.MISSION_NEW))}
          >
            <span>Ajouter une nouvelle mission</span>
          </AddNewMissionButton>
        </SideWindowHeader>
        <SideWindowContent>
          <MissionsTableFilters />
          <NumberOfDisplayedMissions data-cy="Missions-numberOfDisplayedMissions">
            {data?.length || '0'} Mission{data && data.length > 1 ? 's' : ''}
          </NumberOfDisplayedMissions>
          <TableWrapper>
            {isError ? (
              <ErrorMessage data-cy="listMissionWrapper">Erreur au chargement des données</ErrorMessage>
            ) : (
              <MissionsTable data={data} isLoading={isLoading} />
            )}
          </TableWrapper>
        </SideWindowContent>
      </>
    </SideWindowWrapper>
  )
}

const SideWindowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`
const ErrorMessage = styled.div``

const SideWindowContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 8px;
`

const NumberOfDisplayedMissions = styled.h3`
  font-size: 13px;
`
const AddNewMissionButton = styled(IconButton)`
  background: ${COLORS.white};
`

const TableWrapper = styled.div`
  flex: 1;
`
