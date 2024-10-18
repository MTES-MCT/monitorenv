import { dashboardsAPI } from '@api/dashboardsAPI'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'

import { dashboardActions } from '../slice'
import { filterDashboardWithExtractedData } from '../utils'

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
        const filteredDashboard = filterDashboardWithExtractedData(dashboard, data)
        const filteredDashboardWithGeom = {
          ...filteredDashboard,
          geom: geometry
        }

        dispatch(
          dashboardActions.updateArea({
            dashboardKey,
            extractedArea: data,
            filteredDashboard: filteredDashboardWithGeom
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
