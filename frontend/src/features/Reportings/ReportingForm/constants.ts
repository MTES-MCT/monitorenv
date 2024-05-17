/**
 * These properties does not require to be sync - so we do not update them.
 * @see https://github.com/MTES-MCT/monitorenv/blob/main/backend/src/main/kotlin/fr/gouv/cacem/monitorenv/infrastructure/api/adapters/bff/outputs/reportings/ReportingDataOutput.kt
 */
export const REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES = ['semaphore', 'controlUnit', 'seaFront']

export const REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM = [
  ...REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES,
  // We do not update this field as it is not used by the form
  'updatedAtUtc'
]
