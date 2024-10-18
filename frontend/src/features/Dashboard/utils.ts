import { isCypress } from '@utils/isCypress'
import { intersection, intersectionBy } from 'lodash'

import type { Dashboard } from './types'

export const isDashboardEnabled = () =>
  isCypress()
    ? window.Cypress.env('CYPRESS_FRONTEND_DASHBOARD_ENABLED') === 'true'
    : import.meta.env.FRONTEND_DASHBOARD_ENABLED === 'true'

export const filterDashboardWithExtractedData = (
  dashboard: Dashboard.Dashboard,
  extractedData: Dashboard.ExtractedArea
): Dashboard.Dashboard => ({
  ...dashboard,
  amps: intersection(
    dashboard.amps,
    extractedData.amps.map(amp => amp.id)
  ),
  inseeCode: extractedData.inseeCode,
  regulatoryAreas: intersection(
    dashboard.regulatoryAreas,
    extractedData.regulatoryAreas.map(reg => reg.id)
  ),
  reportings: intersectionBy(dashboard.reportings, extractedData.reportings, 'id'),
  vigilanceAreas: intersection(
    dashboard.vigilanceAreas,
    extractedData.vigilanceAreas.map(vigilanceArea => vigilanceArea.id)
  )
})
