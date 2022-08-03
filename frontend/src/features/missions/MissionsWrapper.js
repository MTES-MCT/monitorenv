import React from 'react'

import { Missions } from './Missions'
import { CreateOrEditMission } from './CreateOrEditMission'
import { SideWindowRoute } from '../commonComponents/SideWindowRouter/SideWindowRoute'

import { sideWindowPaths } from '../../domain/entities/sideWindow'

export const MissionsWrapper = () => {
  
  return (<>
    <SideWindowRoute path={sideWindowPaths.MISSIONS}>
      <Missions />
    </SideWindowRoute>
    <SideWindowRoute path={sideWindowPaths.MISSION}>
      <CreateOrEditMission />
    </SideWindowRoute>
    <SideWindowRoute path={sideWindowPaths.MISSION_NEW}>
      <CreateOrEditMission />
    </SideWindowRoute>
  </>)
}