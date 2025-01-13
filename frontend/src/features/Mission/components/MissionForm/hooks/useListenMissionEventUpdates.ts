import { useMissionEventContext } from 'context/mission/useMissionEventContext'
import { useEffect, useRef } from 'react'

import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { missionEventListener } from '../sse'

const MISSION_UPDATES_URL = `/api/v1/missions/sse`
const MISSION_UPDATE_EVENT = `MISSION_UPDATE`

export function useListenMissionEventUpdates() {
  const isListeningToEvents = useAppSelector(state => state.missionForms.isListeningToEvents)
  const eventSourceRef = useRef<EventSource>()
  const { contextMissionEvent, setMissionEventInContext } = useMissionEventContext()
  const listener = useRef(missionEventListener(mission => setMissionEventInContext(mission)))

  useEffect(() => {
    eventSourceRef.current = new EventSource(MISSION_UPDATES_URL)

    eventSourceRef.current?.addEventListener('open', () => {
      // eslint-disable-next-line no-console
      console.log(`SSE: Connected to missions endpoint.`)
    })

    return () => {
      eventSourceRef?.current?.close()
    }
  }, [])

  useEffect(() => {
    if (!isListeningToEvents) {
      eventSourceRef.current?.removeEventListener(MISSION_UPDATE_EVENT, listener.current)
      setMissionEventInContext(undefined)

      return
    }
    listener.current = missionEventListener(mission => setMissionEventInContext(mission))
    eventSourceRef.current?.addEventListener(MISSION_UPDATE_EVENT, listener.current)
  }, [isListeningToEvents, setMissionEventInContext])

  return contextMissionEvent
}
