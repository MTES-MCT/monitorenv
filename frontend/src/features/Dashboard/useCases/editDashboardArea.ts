import { dashboardsAPI } from '@api/dashboardsAPI'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'

import { dashboardActions } from '../slice'
import { getPopulatedExtractedArea } from '../utils'

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
        const extractedArea = await getPopulatedExtractedArea(data, dispatch)

        const updatedAmpIds = dashboard.ampIds.filter(id => data.ampIds.includes(id))
        const updatedRegulatoryAreaIds = dashboard.regulatoryAreaIds.filter(id => data.regulatoryAreaIds.includes(id))
        const updatedVigilanceAreaIds = dashboard.vigilanceAreaIds.filter(id => data.vigilanceAreaIds.includes(id))
        const updatedReportingIds = dashboard.reportingIds.filter(id => data.reportingIds.includes(id))
        const updatedDashboard = {
          ...dashboard,
          ampIds: updatedAmpIds,
          geom: geometry,
          regulatoryAreaIds: updatedRegulatoryAreaIds,
          reportingIds: updatedReportingIds,
          vigilanceAreaIds: updatedVigilanceAreaIds
        }

        dispatch(
          dashboardActions.updateArea({
            dashboard: { ...updatedDashboard, geom: geometry },
            dashboardKey,
            extractedArea
          })
        )
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
