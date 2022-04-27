import React from 'react'
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { useGetMissionsQuery } from '../../api/missionsAPI'
import { setSideWindowPath } from '../commonComponents/SideWindowRouter/SideWindowRouter.slice';
import { sideWindowPaths } from '../../domain/entities/sideWindow';

import { SideWindowHeader } from '../side_window/SideWindowHeader';
import { MissionsTable } from './MissionsList/MissionsTable';
import { MissionsFilter } from './MissionsList/MissionsFilter';

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
        <div style={{width: "100%"}}>
          <SideWindowHeader title={"Missions et contrôles"}>
            <AddNewMissionButton onClick={() => dispatch(setSideWindowPath(sideWindowPaths.MISSION_NEW))}>Ajouter une nouvelle mission</AddNewMissionButton>
          </SideWindowHeader>
          <MissionsFilter></MissionsFilter>
          <NumberOfDisplayedMissions>{data.length} Mission{data.length > 1 ? 's' : ''}</NumberOfDisplayedMissions>
          <MissionsTable data={data} isLoading={isLoading} />
        </div>
      ) : null}
    </div>
  )
}

const NumberOfDisplayedMissions = styled.h3`
  
`
const AddNewMissionButton = styled.button`
`