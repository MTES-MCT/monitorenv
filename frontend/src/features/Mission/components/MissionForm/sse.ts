import { undefine } from '@mtes-mct/monitor-ui'

import { isMissionAutoUpdateEnabled } from './utils'

import type { Mission } from '../../../../domain/entities/missions'

export const missionEventListener = (callback: (mission: Mission) => void) => (event: MessageEvent) => {
  const mission = undefine(JSON.parse(event.data)) as Mission

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
