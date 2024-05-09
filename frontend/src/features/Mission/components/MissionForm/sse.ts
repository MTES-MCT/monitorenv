import { Mission } from '@features/Mission/mission.type'

import { isMissionAutoUpdateEnabled } from './utils'

export const missionEventListener = (callback: (mission: Mission.Mission) => void) => (event: MessageEvent) => {
  const mission = JSON.parse(event.data) as Mission.Mission

  // eslint-disable-next-line no-console
  console.log(`SSE: received a mission update.`)

  if (!isMissionAutoUpdateEnabled()) {
    // eslint-disable-next-line no-console
    console.log(
      'Skipping automatic update of mission form. ' +
        "Set 'FRONTEND_MISSION_FORM_AUTO_UPDATE=true' feature flag to activate this feature."
    )

    return
  }

  callback(mission)
}
