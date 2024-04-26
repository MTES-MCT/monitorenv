import { useContext } from 'react'

import { MissionEventContext } from './MissionEventContext'

export const useMissionEventContext = () => {
  const missionEventContext = useContext(MissionEventContext)
  if (missionEventContext === undefined) {
    throw new Error('useMissionEventContext must be inside a MissionEventContext')
  }

  return missionEventContext
}
