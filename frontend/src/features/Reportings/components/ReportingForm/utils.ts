import { isCypress } from '@utils/isCypress'
import { undefinedize } from '@utils/undefinedize'
import { isEqual, omit } from 'lodash-es'

import { REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM } from './constants'

import type { Reporting } from 'domain/entities/reporting'
import type { AtLeast } from 'types'

/* Is auto-save enabled.
 *
 * When running Cypress tests, we modify this env var in spec file, so we use `window.Cypress.env()`
 * instead of `import.meta.env`.
 */
export const isReportingAutoSaveEnabled = () =>
  isCypress()
    ? window.Cypress.env('CYPRESS_REPORTING_FORM_AUTO_SAVE_ENABLED') === 'true'
    : import.meta.env.FRONTEND_REPORTING_FORM_AUTO_SAVE_ENABLED === 'true'

export const isReportingAutoUpdateEnabled = () =>
  isCypress()
    ? window.Cypress.env('CYPRESS_REPORTING_FORM_AUTO_UPDATE') === 'true'
    : import.meta.env.FRONTEND_REPORTING_FORM_AUTO_UPDATE === 'true'

/**
 * should a Formik `onChange` event trigger `saveReporting`.
 */
export function shouldSaveReporting(
  previousValues: AtLeast<Reporting, 'id'> | undefined,
  reportingEvent: Reporting | undefined,
  nextValues: Reporting
): boolean {
  if (!previousValues) {
    return false
  }

  /**
   * If a reporting event has just been received, block the re-submit of the same fields.
   */
  if (
    isEqual(
      omit(undefinedize(reportingEvent), [...REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM, 'attachedMission']),
      omit(undefinedize(nextValues), [...REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM, 'attachedMission'])
    )
  ) {
    return false
  }

  /**
   * Send an update only if a field has beem modified except for updatedAtUtcField
   */
  return !isEqual(
    omit(undefinedize(previousValues), [...REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM, 'attachedMission']),
    omit(undefinedize(nextValues), [...REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM, 'attachedMission'])
  )
}
