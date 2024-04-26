import { useReportingEventContext } from 'context/reporting/useReportingEventContext'
import { useEffect, useRef } from 'react'

import { useAppSelector } from '../../../../hooks/useAppSelector'
import { reportingEventListener } from '../sse'

const REPORTING_UPDATES_URL = `/bff/v1/reportings/sse`
const REPORTING_UPDATE_EVENT = `REPORTING_UPDATE`

export function useListenReportingEventUpdates() {
  const isListeningToEvents = useAppSelector(state => state.reporting.isListeningToEvents)
  const eventSourceRef = useRef<EventSource>()
  const { contextReportingEvent, setReportingEventInContext } = useReportingEventContext()
  const listener = useRef(reportingEventListener(reporting => setReportingEventInContext(reporting)))

  useEffect(() => {
    eventSourceRef.current = new EventSource(REPORTING_UPDATES_URL)

    eventSourceRef.current?.addEventListener('open', () => {
      // eslint-disable-next-line no-console
      console.log(`SSE: Connected to reportings endpoint.`)
    })

    return () => {
      eventSourceRef?.current?.close()
    }
  }, [])

  useEffect(() => {
    if (!isListeningToEvents) {
      eventSourceRef.current?.removeEventListener(REPORTING_UPDATE_EVENT, listener.current)
      setReportingEventInContext(undefined)

      return
    }
    listener.current = reportingEventListener(reporting => setReportingEventInContext(reporting))
    eventSourceRef.current?.addEventListener(REPORTING_UPDATE_EVENT, listener.current)
  }, [isListeningToEvents, setReportingEventInContext])

  return contextReportingEvent
}
