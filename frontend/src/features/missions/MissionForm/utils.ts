import { isEqual, omit } from 'lodash'

import type { Mission, NewMission } from '../../../domain/entities/missions'

/**
 * should a Formik `onChange` event trigger trigger `saveMission`.
 */
export function shouldSaveMission(
  previousValues: Partial<Mission | NewMission> | undefined,
  nextValues: Partial<Mission | NewMission>
): boolean {
  if (!previousValues) {
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

  return !isEqual(filteredPreviousValues, filteredNextValues)
}

function filterActionsFormInternalProperties(values: Partial<Mission | NewMission>) {
  return values.envActions?.map(envAction => omit(envAction, 'durationMatchesMission')) || []
}
