import { useEffect, useRef, useState } from 'react'

import { useAppSelector } from '../../../../hooks/useAppSelector'
import { missionEventListener } from '../sse'

import type { Mission } from '../../../../domain/entities/missions'

const MISSION_UPDATES_URL = `/api/v1/missions/sse`
const MISSION_UPDATE_EVENT = `MISSION_UPDATE`

export function useListenMissionEventUpdates() {
  const isListeningToEvents = useAppSelector(state => state.missionForms.isListeningToEvents)
  const eventSourceRef = useRef<EventSource>()
  const [missionEvent, setMissionEvent] = useState<Mission>()
  const listener = useRef(missionEventListener(mission => setMissionEvent(mission)))

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

      return
    }

    listener.current = missionEventListener(mission => setMissionEvent(mission))
    eventSourceRef.current?.addEventListener(MISSION_UPDATE_EVENT, listener.current)
  }, [isListeningToEvents])

  return missionEvent
}
