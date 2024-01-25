import { MISSION_FORM_AUTO_UPDATE_ENABLED } from '../../../env'

import type { Mission } from '../../../domain/entities/missions'

/**
 * These properties does not require to be sync - so we do not update them.
 * @see https://github.com/MTES-MCT/monitorenv/blob/main/backend/src/main/kotlin/fr/gouv/cacem/monitorenv/infrastructure/api/adapters/publicapi/outputs/MissionDataOutput.kt#L11
 */
export const MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES = [
  'attachedReportingIds',
  'attachedReportings',
  'detachedReportingIds',
  'detachedReportings',
  // TODO add the update of the env actions
  // `envActions` is included but `reportingIds` is missing
  'envActions'
]

export const MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM = [
  ...MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES,
  // Only used by MonitorFish
  'isGeometryComputedFromControls',
  // We do not update this field as it is not used by the form
  'updatedAtUtc',
  // We do not update this field as it is not used by the form
  'createdAtUtc',
  // TODO add the update of the env actions
  'envActions'
]

export const missionEventListener = (callback: (mission: Mission) => void) => (event: MessageEvent) => {
  const mission = JSON.parse(event.data) as Mission

  // eslint-disable-next-line no-console
  console.log(`SSE: received a mission update.`)

  if (MISSION_FORM_AUTO_UPDATE_ENABLED === 'false') {
    // eslint-disable-next-line no-console
    console.log(
      'Skipping automatic update of mission form. ' +
        "Set 'REACT_APP_MISSION_FORM_AUTO_UPDATE=true' feature flag to activate this feature."
    )

    return
  }

  callback(mission)
}
