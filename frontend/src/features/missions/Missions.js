import _ from 'lodash'
import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { useGetMissionsQuery } from '../../api/missionsAPI'
import { setSideWindowPath } from '../../components/SideWindowRouter/SideWindowRouter.slice'
import { COLORS } from '../../constants/constants'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { ReactComponent as PlusSVG } from '../../uiMonitor/icons/Plus.svg'
import { SideWindowHeader } from '../side_window/SideWindowHeader'
import { MissionsTable } from './MissionsList/MissionsTable'
import { MissionsTableFilters } from './MissionsList/MissionsTableFilters'

const TWO_MINUTES = 2 * 60 * 1000
export function Missions() {
  const dispatch = useDispatch()
  const { data, isError, isLoading } = useGetMissionsQuery(undefined, { pollingInterval: TWO_MINUTES })

  const { missionNatureFilter, missionStatusFilter, missionTypeFilter } = useSelector(state => state.missionFilters)
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

  return (
    <SideWindowWrapper data-cy="listMissionWrapper">
      {isError ? (
        <>Erreur au chargement des données</>
      ) : isLoading ? (
        <>Chargement en cours...</>
      ) : data ? (
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
              {filteredData.length} Mission{filteredData.length > 1 ? 's' : ''}
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
const AddNewMissionButton = styled(IconButton)``

const TableWrapper = styled.div`
  flex: 1;
`
