import { createContext, useState, useMemo } from 'react'

import type { Mission } from 'domain/entities/missions'

type MissionEventContextProps = {
  contextMissionEvent: Mission | undefined
  getMissionEventById: (missionId: number | string | undefined) => Mission | undefined
  setMissionEventInContext: React.Dispatch<React.SetStateAction<Mission | undefined>>
}
export const MissionEventContext = createContext<MissionEventContextProps | undefined>(undefined)

export function MissionEventProvider({ children }) {
  const [contextMissionEvent, setMissionEventInContext] = useState<Mission | undefined>(undefined)
  const contextValue = useMemo(
    () => ({
      contextMissionEvent,
      getMissionEventById: (missionId: number | string | undefined) =>
        missionId && contextMissionEvent?.id === missionId ? (contextMissionEvent as Mission | undefined) : undefined,
      setMissionEventInContext
    }),
    [contextMissionEvent, setMissionEventInContext]
  )

  return <MissionEventContext.Provider value={contextValue}>{children}</MissionEventContext.Provider>
}
