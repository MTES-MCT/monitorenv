import { undefine } from '@mtes-mct/monitor-ui'

import { isReportingAutoUpdateEnabled } from './utils'

import type { Reporting } from 'domain/entities/reporting'

export const reportingEventListener = (callback: (reporting: Reporting) => void) => (event: MessageEvent) => {
  const reporting = undefine(JSON.parse(event.data)) as Reporting

  // eslint-disable-next-line no-console
  console.log(`SSE: received a reporting update.`)

  if (!isReportingAutoUpdateEnabled()) {
    // eslint-disable-next-line no-console
    console.log(
      'Skipping automatic update of reporting form. ' +
        "Set 'FRONTEND_REPORTING_FORM_AUTO_UPDATE=true' feature flag to activate this feature."
    )

    return
  }

  callback(reporting)
}
