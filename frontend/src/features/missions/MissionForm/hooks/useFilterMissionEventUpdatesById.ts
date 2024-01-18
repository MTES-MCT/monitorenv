import { useContext } from 'react'

import { MissionEventContext } from '../../../../context/MissionEventContext'

import type { Mission } from '../../../../domain/entities/missions'

export function useFilterMissionEventUpdatesById(missionId: number | string | undefined) {
  const missionEvent = useContext(MissionEventContext)

  return missionId && missionEvent?.id === missionId ? (missionEvent as Mission | undefined) : undefined
}
