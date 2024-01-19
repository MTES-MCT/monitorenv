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

  const filteredNextValues = {
    ...nextValues,
    envActions: nextValues.envActions?.map(envAction => omit(envAction, 'durationMatchesMission')) || []
  }

  return !isEqual(previousValues, filteredNextValues)
}
