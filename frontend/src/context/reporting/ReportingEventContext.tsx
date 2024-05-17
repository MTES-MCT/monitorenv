import { createContext, useState, useMemo } from 'react'

import type { Reporting } from 'domain/entities/reporting'

type ReportingEventContextProps = {
  contextReportingEvent: Reporting | undefined
  getReportingEventById: (id: number | string | undefined) => Reporting | undefined
  setReportingEventInContext: React.Dispatch<React.SetStateAction<Reporting | undefined>>
}
export const ReportingEventContext = createContext<ReportingEventContextProps | undefined>(undefined)

export function ReportingEventProvider({ children }) {
  const [contextReportingEvent, setReportingEventInContext] = useState<Reporting | undefined>(undefined)
  const contextValue = useMemo(
    () => ({
      contextReportingEvent,
      getReportingEventById: (id: number | string | undefined) =>
        id && contextReportingEvent?.id === id ? (contextReportingEvent as Reporting | undefined) : undefined,
      setReportingEventInContext
    }),
    [contextReportingEvent, setReportingEventInContext]
  )

  return <ReportingEventContext.Provider value={contextValue}>{children}</ReportingEventContext.Provider>
}
