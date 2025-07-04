/**
 * These properties does not require to be sync - so we do not update them.
 * @see https://github.com/MTES-MCT/monitorenv/blob/main/backend/src/main/kotlin/fr/gouv/cacem/monitorenv/infrastructure/api/adapters/publicapi/outputs/MissionDataOutput.kt#L11
 */
export const MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES = [
  'attachedReportingIds',
  'detachedReportingIds',
  'detachedReportings',
  // TODO add the update of the env actions
  // `envActions` is included but `reportingIds` is missing
  'envActions',
  'fishActions',
  'hasRapportNavActions',
  'observationsByUnit'
]

export const MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM = [
  ...MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES,
  'facade',
  // We do not update this field as it is not used by the form
  'updatedAtUtc',
  // We do not update this field as it is not used by the form
  'createdAtUtc'
]

export const HIDDEN_ERROR = 'HIDDEN_ERROR'
