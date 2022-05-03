import React from 'react'
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { useGetMissionsQuery } from '../../api/missionsAPI'
import { setSideWindowPath } from '../commonComponents/SideWindowRouter/SideWindowRouter.slice';
import { sideWindowPaths } from '../../domain/entities/sideWindow';

import { SideWindowHeader } from '../side_window/SideWindowHeader';
import { MissionsTable } from './MissionsList/MissionsTable';
import { MissionsFilter } from './MissionsList/MissionsFilter';
import { COLORS } from '../../constants/constants';
import { PlusIcon } from '../commonStyles/icons/PlusIcon';

export const Missions = () => {
  const dispatch = useDispatch()
  const { data, isError, isLoading } = useGetMissionsQuery()


  return (
    <div style={{flex:1}} >
      {isError ? (
        <>Erreur au chargement des données</>
      ) : isLoading ? (
        <>Chargement en cours...</>
      ) : data ? (
        <SideWindowWrapper>
          <SideWindowHeader title={"Missions et contrôles"}>
            <AddNewMissionButton onClick={() => dispatch(setSideWindowPath(sideWindowPaths.MISSION_NEW))}>

              <PlusIcon /> <span>Ajouter une nouvelle mission</span>
            </AddNewMissionButton>
          </SideWindowHeader>
          <SideWindowContent>
            <MissionsFilter></MissionsFilter>
            <NumberOfDisplayedMissions>{data.length} Mission{data.length > 1 ? 's' : ''}</NumberOfDisplayedMissions>
            <MissionsTable data={data} isLoading={isLoading} />
          </SideWindowContent>
        </SideWindowWrapper>
      ) : null}
    </div>
  )
}

const SideWindowWrapper = styled.div`
`

const SideWindowContent = styled.div`
  padding: 8px;
`

const NumberOfDisplayedMissions = styled.h3`
  
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