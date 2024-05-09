import { Mission } from '@features/Mission/mission.type'
import { createContext, useState, useMemo } from 'react'

type MissionEventContextProps = {
  contextMissionEvent: Mission.Mission | undefined
  getMissionEventById: (missionId: number | string | undefined) => Mission.Mission | undefined
  setMissionEventInContext: React.Dispatch<React.SetStateAction<Mission.Mission | undefined>>
}
export const MissionEventContext = createContext<MissionEventContextProps | undefined>(undefined)

export function MissionEventProvider({ children }) {
  const [contextMissionEvent, setMissionEventInContext] = useState<Mission.Mission | undefined>(undefined)
  const contextValue = useMemo(
    () => ({
      contextMissionEvent,
      getMissionEventById: (missionId: number | string | undefined) =>
        missionId && contextMissionEvent?.id === missionId
          ? (contextMissionEvent as Mission.Mission | undefined)
          : undefined,
      setMissionEventInContext
    }),
    [contextMissionEvent, setMissionEventInContext]
  )

  return <MissionEventContext.Provider value={contextValue}>{children}</MissionEventContext.Provider>
}
