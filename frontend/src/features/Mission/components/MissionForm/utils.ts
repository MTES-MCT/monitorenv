import { isEqual, omit } from 'lodash-es'

import { MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM } from './constants'
import { NewMissionSchema } from './Schemas'
import { isCypress } from '../../../../utils/isCypress'

import type { Mission, NewMission } from '../../../../domain/entities/missions'

/**
 * Is auto-save enabled.
 *
 * When running Cypress tests, we modify this env var in spec file, so we use `window.Cypress.env()`
 * instead of `import.meta.env`.
 */
export const isMissionAutoSaveEnabled = () =>
  isCypress()
    ? window.Cypress.env('CYPRESS_MISSION_FORM_AUTO_SAVE_ENABLED') === 'true'
    : import.meta.env.FRONTEND_MISSION_FORM_AUTO_SAVE_ENABLED === 'true'
export const isMissionAutoUpdateEnabled = () =>
  isCypress()
    ? window.Cypress.env('CYPRESS_MISSION_FORM_AUTO_UPDATE') === 'true'
    : import.meta.env.FRONTEND_MISSION_FORM_AUTO_UPDATE === 'true'

/**
 * should a Formik `onChange` event trigger `saveMission`.
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
    ...omit(previousValues, ['attachedReportings', 'detachedReportings']),
    envActions: filterActionsFormInternalProperties(previousValues)
  }
  const filteredNextValues = {
    ...omit(nextValues, ['attachedReportings', 'detachedReportings']),
    envActions: filterActionsFormInternalProperties(nextValues)
  }

  /**
   * Send an update only if a field has beem modified
   */
  return !isEqual(filteredPreviousValues, filteredNextValues)
}

function filterActionsFormInternalProperties(values: Partial<Mission | NewMission>) {
  return values.envActions?.map(envAction => omit(envAction, 'durationMatchesMission')) ?? []
}

export function getIsMissionFormValid(mission: Partial<Mission | NewMission>): boolean {
  try {
    NewMissionSchema.validateSync(mission, { abortEarly: false })

    return true
  } catch (e: any) {
    return false
  }
}
