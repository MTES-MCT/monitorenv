import { isEqual, omit, pick } from 'lodash'

import type { Mission, NewMission } from '../../../domain/entities/missions'

/**
 * should a Formik `onChange` event trigger trigger `saveMission`.
 */
export function shouldSaveMission(
  previousValues: Partial<Mission | NewMission> | undefined,
  nextValues: Partial<Mission | NewMission>,
  receivedMissionEvent: Mission | undefined
): boolean {
  if (!previousValues) {
    return false
  }

  const nextValuesWithOnlyActionsOrReportingFields = pick(nextValues, [
    'attachedReportingIds',
    'attachedReportings',
    'detachedReportings',
    'detachedReportingIds',
    'envActions'
  ])
  const valuesWithOnlyActionsOrReportingFields = pick(previousValues, [
    'attachedReportingIds',
    'attachedReportings',
    'detachedReportings',
    'detachedReportingIds',
    'envActions'
  ])

  /**
   * When a field from an "Action" or "Reporting" has been modified, save the mission.
   */
  if (!isEqual(nextValuesWithOnlyActionsOrReportingFields, valuesWithOnlyActionsOrReportingFields)) {
    return true
  }

  const nextValuesWithOnlyMissionFields = omit(nextValues, [
    'attachedReportingIds',
    'attachedReportings',
    'detachedReportings',
    'detachedReportingIds',
    'createdAtUtc',
    'updatedAtUtc',
    'envActions',
    'facade'
  ])
  const receivedMissionWithOnlyMissionFields = omit(receivedMissionEvent, [
    'isGeometryComputedFromControls',
    'createdAtUtc',
    'updatedAtUtc',
    'envActions',
    'facade'
  ])
  const previousValuesWithOnlyMissionFields = omit(previousValues, [
    'attachedReportingIds',
    'attachedReportings',
    'detachedReportings',
    'detachedReportingIds',
    'createdAtUtc',
    'updatedAtUtc',
    'envActions',
    'facade'
  ])

  /**
   * When a field from the base mission differ from the last mission received from the API, save the mission.
   * It prevent re-sending the form when receiving an update.
   */
  if (receivedMissionEvent) {
    return !isEqual(receivedMissionWithOnlyMissionFields, nextValuesWithOnlyMissionFields)
  }

  return !isEqual(previousValuesWithOnlyMissionFields, nextValuesWithOnlyMissionFields)
}
