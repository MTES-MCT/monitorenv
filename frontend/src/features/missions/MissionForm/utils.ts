import { isEqual, omit } from 'lodash'

import { MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM } from './sse'

import type { Mission, NewMission } from '../../../domain/entities/missions'

/**
 * should a Formik `onChange` event trigger trigger `saveMission`.
 */
export function shouldSaveMission(
  previousValues: Partial<Mission | NewMission> | undefined,
  missionEvent: Partial<Mission> | undefined,
  nextValues: Partial<Mission | NewMission>
): boolean {
  if (!previousValues) {
    return false
  }

  /**
   * If a mission event has just been received, block the re-submit of the same fields.
   */
  if (
    isEqual(
      omit(missionEvent, MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM),
      omit(nextValues, MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM)
    )
  ) {
    return false
  }

  const filteredPreviousValues = {
    ...previousValues,
    envActions: filterActionsFormInternalProperties(previousValues)
  }
  const filteredNextValues = {
    ...nextValues,
    envActions: filterActionsFormInternalProperties(nextValues)
  }

  /**
   * Send an update only if a field has beem modified
   */
  return !isEqual(filteredPreviousValues, filteredNextValues)
}

function filterActionsFormInternalProperties(values: Partial<Mission | NewMission>) {
  return values.envActions?.map(envAction => omit(envAction, 'durationMatchesMission')) || []
}
