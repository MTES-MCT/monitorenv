import { useContext } from 'react'

import { ReportingEventContext } from './ReportingEventContext'

export const useReportingEventContext = () => {
  const reportingEventContext = useContext(ReportingEventContext)
  if (reportingEventContext === undefined) {
    throw new Error('useReportingEventContext must be inside a ReportingEventContext')
  }

  return reportingEventContext
}
