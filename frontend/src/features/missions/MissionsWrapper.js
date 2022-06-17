import React from 'react'

import { Missions } from './Missions'
import { EditMission } from './EditMission'
import { NewMission } from './NewMission'
import { SideWindowRoute } from '../commonComponents/SideWindowRouter/SideWindowRoute'

import { sideWindowPaths } from '../../domain/entities/sideWindow'

export const MissionsWrapper = () => {
  
  return (<>
    <SideWindowRoute path={sideWindowPaths.MISSIONS}>
      <Missions />
    </SideWindowRoute>
    <SideWindowRoute path={sideWindowPaths.MISSION}>
      <EditMission />
    </SideWindowRoute>
    <SideWindowRoute path={sideWindowPaths.MISSION_NEW}>
      <NewMission />
    </SideWindowRoute>
  </>)
}