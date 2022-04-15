import React, {useState} from 'react'
import { MissionsList } from './MissionsList'
import { MissionDetail } from './MissionDetail'

export const MissionsWrapper = () => {
  const  [missionId, setMissionId] = useState(null)
  return (<div style={{display: "flex", flexDirection:'column', flex:1}}>
  <MissionsList setMission={setMissionId}></MissionsList>
  <MissionDetail id={missionId}></MissionDetail>
  </div>)
}