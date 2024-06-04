import { createContext, useState, useMemo } from 'react'

import type { Reporting } from 'domain/entities/reporting'

type ReportingEventContextProps = {
  contextReportingEvent: Reporting | undefined
  getReportingEventById: (id: number | string | undefined) => Reporting | undefined
  scrollPosition: number
  setReportingEventInContext: React.Dispatch<React.SetStateAction<Reporting | undefined>>
  setScrollPosition: React.Dispatch<React.SetStateAction<number>>
}
export const ReportingEventContext = createContext<ReportingEventContextProps | undefined>(undefined)

export function ReportingEventProvider({ children }) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [contextReportingEvent, setReportingEventInContext] = useState<Reporting | undefined>(undefined)
  const contextValue = useMemo(
    () => ({
      contextReportingEvent,
      getReportingEventById: (id: number | string | undefined) =>
        id && contextReportingEvent?.id === id ? (contextReportingEvent as Reporting | undefined) : undefined,
      scrollPosition,
      setReportingEventInContext,
      setScrollPosition
    }),
    [contextReportingEvent, scrollPosition]
  )

  return <ReportingEventContext.Provider value={contextValue}>{children}</ReportingEventContext.Provider>
}
