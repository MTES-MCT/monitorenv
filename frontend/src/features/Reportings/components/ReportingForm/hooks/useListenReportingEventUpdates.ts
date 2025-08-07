import { useAppSelector } from '@hooks/useAppSelector'
import { useReportingEventContext } from 'context/reporting/useReportingEventContext'
import { useEffect, useRef } from 'react'

import { reportingEventListener } from '../sse'

const REPORTING_UPDATES_URL = `/bff/reportings/sse`
const REPORTING_UPDATE_EVENT = `REPORTING_UPDATE`

export function useListenReportingEventUpdates() {
  const isListeningToEvents = useAppSelector(state => state.reporting.isListeningToEvents)
  const isSuperUser = useAppSelector(state => state.account.isSuperUser)
  const eventSourceRef = useRef<EventSource>()
  const { contextReportingEvent, setReportingEventInContext } = useReportingEventContext()
  const listener = useRef(reportingEventListener(reporting => setReportingEventInContext(reporting)))

  useEffect(() => {
    if (!isSuperUser) {
      return eventSourceRef?.current?.close()
    }
    eventSourceRef.current = new EventSource(REPORTING_UPDATES_URL)

    return () => {
      eventSourceRef?.current?.close()
    }
  }, [isSuperUser])

  useEffect(() => {
    if (!isListeningToEvents) {
      eventSourceRef.current?.removeEventListener(REPORTING_UPDATE_EVENT, listener.current)
      setReportingEventInContext(undefined)

      return undefined
    }

    listener.current = reportingEventListener(reporting => setReportingEventInContext(reporting))
    eventSourceRef.current?.addEventListener(REPORTING_UPDATE_EVENT, listener.current)

    return () => {
      eventSourceRef.current?.removeEventListener(REPORTING_UPDATE_EVENT, listener.current)
    }
  }, [isListeningToEvents, setReportingEventInContext])

  return contextReportingEvent
}
