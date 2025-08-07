import { useMissionEventContext } from 'context/mission/useMissionEventContext'
import { useEffect, useRef } from 'react'

import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { missionEventListener } from '../sse'

const MISSION_UPDATES_URL = `/api/v1/missions/sse`
export const MISSION_UPDATE_EVENT = `MISSION_UPDATE`
export const FULL_MISSION_UPDATE_EVENT = `FULL_MISSION_UPDATE`

export function useListenMissionEventUpdates() {
  const isListeningToEvents = useAppSelector(state => state.missionForms.isListeningToEvents)
  const eventSourceRef = useRef<EventSource>()
  const { contextMissionEvent, setEventType, setMissionEventInContext } = useMissionEventContext()
  const listener = useRef(
    missionEventListener((mission, event) => {
      setMissionEventInContext(mission)
      setEventType(event)
    })
  )

  useEffect(() => {
    eventSourceRef.current = new EventSource(MISSION_UPDATES_URL)

    return () => {
      eventSourceRef?.current?.close()
    }
  }, [])

  useEffect(() => {
    if (!isListeningToEvents) {
      eventSourceRef.current?.removeEventListener(MISSION_UPDATE_EVENT, listener.current)
      eventSourceRef.current?.removeEventListener(FULL_MISSION_UPDATE_EVENT, listener.current)
      setMissionEventInContext(undefined)
      setEventType(undefined)

      return undefined
    }
    listener.current = missionEventListener((mission, event) => {
      setMissionEventInContext(mission)
      setEventType(event)
    })

    eventSourceRef.current?.addEventListener(MISSION_UPDATE_EVENT, listener.current)
    eventSourceRef.current?.addEventListener(FULL_MISSION_UPDATE_EVENT, listener.current)

    return () => {
      eventSourceRef.current?.removeEventListener(MISSION_UPDATE_EVENT, listener.current)
      eventSourceRef.current?.removeEventListener(FULL_MISSION_UPDATE_EVENT, listener.current)
    }
  }, [isListeningToEvents, setMissionEventInContext, setEventType])

  return contextMissionEvent
}
