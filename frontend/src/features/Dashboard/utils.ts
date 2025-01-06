import { ampsAPI } from '@api/ampsAPI'
import { regulatoryLayersAPI } from '@api/regulatoryLayersAPI'
import { reportingsAPI } from '@api/reportingsAPI'
import { vigilanceAreasAPI } from '@api/vigilanceAreasAPI'
import { isCypress } from '@utils/isCypress'

import type { Dashboard } from './types'
import type { HomeRootState } from '@store/index'
import type { Action } from 'redux'
import type { ThunkDispatch } from 'redux-thunk'

export const isDashboardEnabled = () =>
  isCypress()
    ? window.Cypress.env('CYPRESS_FRONTEND_DASHBOARD_ENABLED') === 'true'
    : import.meta.env.FRONTEND_DASHBOARD_ENABLED === 'true'

export const getPopulatedExtractedArea = async (
  extractedAreaFromApi: Dashboard.ExtractedAreaFromApi,
  dispatch: ThunkDispatch<HomeRootState, void, Action>
) => populateExtractAreaFromApi(dispatch, extractedAreaFromApi)

export async function populateExtractAreaFromApi(
  dispatch: ThunkDispatch<HomeRootState, void, Action>,
  extractedAreaFromApi: Dashboard.ExtractedAreaFromApi
): Promise<Dashboard.ExtractedArea> {
  const { data: regulatoryLayers } = await dispatch(regulatoryLayersAPI.endpoints.getRegulatoryLayers.initiate())
  const { data: ampLayers } = await dispatch(ampsAPI.endpoints.getAMPs.initiate())
  const { data: vigilanceAreas } = await dispatch(vigilanceAreasAPI.endpoints.getVigilanceAreas.initiate())
  const { data: reportings } = await dispatch(
    reportingsAPI.endpoints.getReportingsByIds.initiate(extractedAreaFromApi.reportingIds)
  )

  return {
    ...extractedAreaFromApi,
    amps: Object.values(ampLayers?.entities ?? []).filter(amp => extractedAreaFromApi.ampIds.includes(amp.id)),
    regulatoryAreas: Object.values(regulatoryLayers?.entities ?? []).filter(reg =>
      extractedAreaFromApi.regulatoryAreaIds.includes(reg.id)
    ),
    reportings: Object.values(reportings?.entities ?? []),
    vigilanceAreas: Object.values(vigilanceAreas?.entities ?? []).filter(vigilanceArea =>
      extractedAreaFromApi.vigilanceAreaIds.includes(vigilanceArea.id)
    )
  }
}
