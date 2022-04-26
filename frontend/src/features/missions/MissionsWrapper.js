import React from 'react'

import { MissionsList } from './MissionsList'
import { MissionDetail } from './MissionDetail'
import { SideWindowRoute } from '../commonComponents/SideWindowRouter/SideWindowRoute'

import { sideWindowPaths } from '../../domain/entities/sideWindow'

export const MissionsWrapper = () => {
  
  return (<div style={{display: "flex", flexDirection:'column', flex:1}}>
    <SideWindowRoute path={sideWindowPaths.MISSIONS}>
      <MissionsList ></MissionsList>
    </SideWindowRoute>
    <SideWindowRoute path={sideWindowPaths.MISSION}>
      <MissionDetail></MissionDetail>
    </SideWindowRoute>
  </div>)
}