import { ampsAPI } from '@api/ampsAPI'
import { regulatoryLayersAPI } from '@api/regulatoryLayersAPI'
import { reportingsAPI } from '@api/reportingsAPI'
import { vigilanceAreasAPI } from '@api/vigilanceAreasAPI'
import { isCypress } from '@utils/isCypress'
import { intersection } from 'lodash'

import type { Dashboard } from './types'
import type { HomeRootState } from '@store/index'
import type { GeoJSON } from 'domain/types/GeoJSON'
import type { Action } from 'redux'
import type { ThunkDispatch } from 'redux-thunk'

export const isDashboardEnabled = () =>
  isCypress()
    ? window.Cypress.env('CYPRESS_FRONTEND_DASHBOARD_ENABLED') === 'true'
    : import.meta.env.FRONTEND_DASHBOARD_ENABLED === 'true'

export const getFilteredDashboardAndExtractedArea = async (
  dashboardFromApi: Dashboard.Dashboard,
  geometry: GeoJSON.Geometry,
  extractedAreaFromApi: Dashboard.ExtractedAreaFromApi,
  dispatch: ThunkDispatch<HomeRootState, void, Action>
) => {
  const filteredDashboard = {
    ...updateDashboardDatas(dashboardFromApi, extractedAreaFromApi),
    geom: geometry
  }

  const extractedArea: Dashboard.ExtractedArea = await populateExtractAreaFromApi(dispatch, extractedAreaFromApi)

  return { extractedArea, filteredDashboard }
}

const updateDashboardDatas = (
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

export async function populateExtractAreaFromApi(
  dispatch: ThunkDispatch<HomeRootState, void, Action>,
  extractedAreaFromApi: Dashboard.ExtractedAreaFromApi
) {
  const { data: regulatoryLayers } = await dispatch(regulatoryLayersAPI.endpoints.getRegulatoryLayers.initiate())
  const { data: ampLayers } = await dispatch(ampsAPI.endpoints.getAMPs.initiate())
  const { data: vigilanceAreas } = await dispatch(vigilanceAreasAPI.endpoints.getVigilanceAreas.initiate())
  const { data: reportings } = await dispatch(
    reportingsAPI.endpoints.getReportingsByIds.initiate(extractedAreaFromApi.reportings)
  )

  const extractedArea: Dashboard.ExtractedArea = {
    ...extractedAreaFromApi,
    amps: Object.values(ampLayers?.entities ?? []).filter(amp => extractedAreaFromApi.amps.includes(amp.id)),
    regulatoryAreas: Object.values(regulatoryLayers?.entities ?? []).filter(reg =>
      extractedAreaFromApi.regulatoryAreas.includes(reg.id)
    ),
    reportings: Object.values(reportings?.entities ?? []),
    vigilanceAreas: Object.values(vigilanceAreas?.entities ?? []).filter(vigilanceArea =>
      extractedAreaFromApi.vigilanceAreas.includes(vigilanceArea.id)
    )
  }

  return extractedArea
}
