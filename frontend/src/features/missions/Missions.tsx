import _ from 'lodash'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { useGetMissionsQuery } from '../../api/missionsAPI'
import { setSideWindowPath } from '../../components/SideWindowRouter/SideWindowRouter.slice'
import { COLORS } from '../../constants/constants'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { useAppSelector } from '../../hooks/useAppSelector'
import { ReactComponent as PlusSVG } from '../../uiMonitor/icons/Plus.svg'
import { SideWindowHeader } from '../side_window/SideWindowHeader'
import { MissionsTable } from './MissionsList/MissionsTable'
import { MissionsTableFilters } from './MissionsList/MissionsTableFilters'

const TWO_MINUTES = 2 * 60 * 1000
export function Missions() {
  const dispatch = useDispatch()
  const { missionNatureFilter, missionStartedAfter, missionStartedBefore, missionStatusFilter, missionTypeFilter } =
    useAppSelector(state => state.missionFilters)

  const { data, isError, isLoading } = useGetMissionsQuery(
    {
      startedAfterDateTime: missionStartedAfter || undefined,
      startedBeforeDateTime: missionStartedBefore || undefined
    },
    { pollingInterval: TWO_MINUTES }
  )

  const filteredData = useMemo(
    () =>
      data?.filter(
        r =>
          (_.isEmpty(missionStatusFilter) || missionStatusFilter.includes(r.missionStatus)) &&
          (_.isEmpty(missionNatureFilter) || _.intersection(missionNatureFilter, r.missionNature).length > 0) &&
          (_.isEmpty(missionTypeFilter) || missionTypeFilter.includes(r.missionType))
      ),
    [data, missionStatusFilter, missionNatureFilter, missionTypeFilter]
  )
  if (isError) {
    return <SideWindowWrapper data-cy="listMissionWrapper">Erreur au chargement des données</SideWindowWrapper>
  }
  if (isLoading) {
    return <SideWindowWrapper data-cy="listMissionWrapper">Chargement en cours...</SideWindowWrapper>
  }

  return (
    <SideWindowWrapper data-cy="listMissionWrapper">
      {data ? (
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
              {filteredData?.length} Mission{filteredData && filteredData.length > 1 ? 's' : ''}
            </NumberOfDisplayedMissions>
            <TableWrapper>
              <MissionsTable data={filteredData} isLoading={isLoading} />
            </TableWrapper>
          </SideWindowContent>
        </>
      ) : null}
    </SideWindowWrapper>
  )
}

const SideWindowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

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
