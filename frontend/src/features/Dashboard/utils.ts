import { isCypress } from '@utils/isCypress'
import { intersection } from 'lodash'

import type { Dashboard } from './types'

export const isDashboardEnabled = () =>
  isCypress()
    ? window.Cypress.env('CYPRESS_FRONTEND_DASHBOARD_ENABLED') === 'true'
    : import.meta.env.FRONTEND_DASHBOARD_ENABLED === 'true'

export const updateDashboardDatas = (
  dashboard: Dashboard.Dashboard,
  extractedData: Dashboard.ExtractedAreaFromApi
): Dashboard.Dashboard => ({
  ...dashboard,
  amps: intersection(dashboard.amps, extractedData.amps),
  inseeCode: extractedData.inseeCode,
  regulatoryAreas: intersection(dashboard.regulatoryAreas, extractedData.regulatoryAreas),
  reportings: intersection(dashboard.reportings, extractedData.reportings),
  vigilanceAreas: intersection(dashboard.vigilanceAreas, extractedData.vigilanceAreas)
})
