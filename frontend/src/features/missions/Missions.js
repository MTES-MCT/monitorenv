import React from 'react'
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { useGetMissionsQuery } from '../../api/missionsAPI'
import { setSideWindowPath } from '../commonComponents/SideWindowRouter/SideWindowRouter.slice';
import { sideWindowPaths } from '../../domain/entities/sideWindow';

import { SideWindowHeader } from '../side_window/SideWindowHeader';
import { MissionsTable } from './MissionsList/MissionsTable';
import { MissionsFilter } from './MissionsList/MissionsFilter';
import { PlusIcon } from '../commonStyles/icons/PlusIcon';
import { COLORS } from '../../constants/constants';

export const Missions = () => {
  const dispatch = useDispatch()
  const { data, isError, isLoading } = useGetMissionsQuery()


  return (
    <SideWindowWrapper data-cy={'listMissionWrapper'}>
      {isError ? (
        <>Erreur au chargement des données</>
      ) : isLoading ? (
        <>Chargement en cours...</>
      ) : data ? (
        <>
          <SideWindowHeader title={'Missions et contrôles'}>
            <AddNewMissionButton 
              onClick={() => dispatch(setSideWindowPath(sideWindowPaths.MISSION_NEW))}
              >
              <PlusIcon /> <span>Ajouter une nouvelle mission</span>
            </AddNewMissionButton>
          </SideWindowHeader>
          <SideWindowContent>
            <MissionsFilter />
            <NumberOfDisplayedMissions data-cy={'Missions-numberOfDisplayedMissions'}>
              {data.length} Mission{data.length > 1 ? 's' : ''}
            </NumberOfDisplayedMissions>
            <TableWrapper>
              <MissionsTable data={data} isLoading={isLoading} />
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
const AddNewMissionButton = styled.div`
  margin-right: 8px;
  margin-left: 8px;
  margin-top: 0;
  margin-bottom: 0;
  padding-right: 16px;
  padding-left: 16px;
  height: 40px;
  background-color: ${COLORS.grayBackground};
  color: ${COLORS.charcoal};
  font-weight: bolder;
  display: flex;
  align-items: center;
  cursor: pointer;
`

const TableWrapper = styled.div`
  flex: 1;
`
