import { ampsAPI } from '@api/ampsAPI'
import { dashboardsAPI } from '@api/dashboardsAPI'
import { regulatoryLayersAPI } from '@api/regulatoryLayersAPI'
import { reportingsAPI } from '@api/reportingsAPI'
import { vigilanceAreasAPI } from '@api/vigilanceAreasAPI'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'

import { dashboardActions } from '../slice'
import { updateDashboardDatas } from '../utils'

import type { Dashboard } from '../types'
import type { HomeAppThunk } from '@store/index'
import type { GeoJSON } from 'domain/types/GeoJSON'

export const EDIT_AREA_ERROR_MESSAGE = "Nous n'avons pas pu éditer la zone du tableau de bord"

export const editDashboardArea =
  (geometry: GeoJSON.Geometry, dashboardKey: string): HomeAppThunk =>
  async (dispatch, getState) => {
    const { data, error } = await dispatch(dashboardsAPI.endpoints.getExtratedArea.initiate(geometry))

    if (data) {
      const dashboard = getState().dashboard.dashboards[dashboardKey]?.dashboard
      if (dashboard) {
        const filteredDashboard = {
          ...updateDashboardDatas(dashboard, data),
          geom: geometry
        }

        const { data: regulatoryLayers } = await dispatch(regulatoryLayersAPI.endpoints.getRegulatoryLayers.initiate())
        const { data: ampLayers } = await dispatch(ampsAPI.endpoints.getAMPs.initiate())
        const { data: vigilanceAreas } = await dispatch(vigilanceAreasAPI.endpoints.getVigilanceAreas.initiate())
        const { data: reportings } = await dispatch(
          reportingsAPI.endpoints.getReportingsByIds.initiate(data.reportings)
        )
        const extractedArea: Dashboard.ExtractedArea = {
          ...data,
          amps: Object.values(ampLayers?.entities ?? []).filter(amp => data.amps.includes(amp.id)),
          regulatoryAreas: Object.values(regulatoryLayers?.entities ?? []).filter(reg =>
            data.regulatoryAreas.includes(reg.id)
          ),
          reportings: Object.values(reportings?.entities ?? []),
          vigilanceAreas: Object.values(vigilanceAreas?.entities ?? []).filter(vigilanceArea =>
            data.vigilanceAreas.includes(vigilanceArea.id)
          )
        }

        dispatch(dashboardActions.updateArea({ dashboardKey, extractedArea, filteredDashboard }))
      }
    }
    if (error) {
      dispatch(
        addMainWindowBanner({
          children: EDIT_AREA_ERROR_MESSAGE,
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }
  }
