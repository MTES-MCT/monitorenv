import { MISSION_FORM_AUTO_UPDATE_ENABLED } from '../../../env'

import type { Mission } from '../../../domain/entities/missions'

export const missionEventListener = (callback: (mission: Mission) => void) => (event: MessageEvent) => {
  const mission = JSON.parse(event.data) as Mission

  // eslint-disable-next-line no-console
  console.log(`SSE: received a mission update.`)

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
