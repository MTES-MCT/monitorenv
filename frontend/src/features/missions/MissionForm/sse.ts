import { MISSION_FORM_AUTO_UPDATE_ENABLED } from '../../../env'

import type { Mission } from '../../../domain/entities/missions'

const MISSION_UPDATES_URL = `/api/v1/missions/sse`
export const MISSION_UPDATE_EVENT = `MISSION_UPDATE`

// We need to share this instance to the whole app
let EVENT_SOURCE: EventSource = new EventSource(MISSION_UPDATES_URL)

// Handle reconnection when the backend send a message
reconnectOnError(EVENT_SOURCE)

export function getMissionUpdatesEventSource(): EventSource {
  return EVENT_SOURCE
}

function reconnectOnError(eventSource: EventSource) {
  // We need to re-attach the `onerror` listener
  // eslint-disable-next-line no-param-reassign
  eventSource.onerror = () => {
    EVENT_SOURCE.close()

    EVENT_SOURCE = new EventSource(MISSION_UPDATES_URL)
    reconnectOnError(EVENT_SOURCE)

    // eslint-disable-next-line no-console
    console.log(`SSE: Reconnected to missions endpoint.`)
  }
}

// eslint-disable-next-line no-console
console.log(`SSE: connected to missions endpoint.`)

export const missionEventListener = (id: number, callback: (mission: Mission) => void) => (event: MessageEvent) => {
  const mission = JSON.parse(event.data) as Mission
  if (mission.id !== id) {
    // eslint-disable-next-line no-console
    console.log(`SSE: filtered an update for mission id ${id} (received mission id ${mission.id}).`)

    return
  }

  // eslint-disable-next-line no-console
  console.log(`SSE: received an update for mission id ${id}.`)

  if (!MISSION_FORM_AUTO_UPDATE_ENABLED) {
    // eslint-disable-next-line no-console
    console.log(
      'Skipping automatic update of mission form. ' +
        "Set 'REACT_APP_MISSION_FORM_AUTO_UPDATE=true' feature flag to activate this feature."
    )

    return
  }

  callback(mission)
}
