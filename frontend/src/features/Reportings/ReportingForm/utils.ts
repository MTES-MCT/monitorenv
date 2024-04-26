import { isCypress } from '@utils/isCypress'
import { isEqual, omit } from 'lodash'

import { REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM } from './constants'

import type { Reporting } from 'domain/entities/reporting'
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
 * should a Formik `onChange` event trigger `saveMission`.
 */
export function shouldSaveReporting(
  previousValues: Partial<Reporting> | undefined,
  reportingEvent: Partial<Reporting> | undefined,
  nextValues: Partial<Reporting>
): boolean {
  if (!previousValues) {
    return false
  }

  /**
   * If a reporting event has just been received, block the re-submit of the same fields.
   */
  if (
    isEqual(
      omit(reportingEvent, REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM),
      omit(nextValues, REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM)
    )
  ) {
    return false
  }

  /**
   * Send an update only if a field has beem modified except for updatedAtUtcField
   */
  return !isEqual(
    omit(previousValues, REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM),
    omit(nextValues, REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM)
  )
}
