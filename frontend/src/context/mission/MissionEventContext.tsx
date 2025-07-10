import { createContext, useState, useMemo } from 'react'

import type { Mission } from 'domain/entities/missions'

type MissionEventContextProps = {
  contextMissionEvent: Mission | undefined
  event: string | undefined
  getMissionEventById: (missionId: number | string | undefined) => Mission | undefined
  setEventType: (eventType: string | undefined) => void
  setMissionEventInContext: React.Dispatch<React.SetStateAction<Mission | undefined>>
}
export const MissionEventContext = createContext<MissionEventContextProps | undefined>(undefined)

export function MissionEventProvider({ children }) {
  const [contextMissionEvent, setMissionEventInContext] = useState<Mission | undefined>(undefined)
  const [event, setEventType] = useState<string | undefined>(undefined)
  const contextValue = useMemo(
    () => ({
      contextMissionEvent,
      event,
      getMissionEventById: (missionId: number | string | undefined) =>
        missionId && contextMissionEvent?.id === missionId ? (contextMissionEvent as Mission | undefined) : undefined,
      setEventType,
      setMissionEventInContext
    }),
    [contextMissionEvent, setMissionEventInContext, event, setEventType]
  )

  return <MissionEventContext.Provider value={contextValue}>{children}</MissionEventContext.Provider>
}
