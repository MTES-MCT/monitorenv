import { dashboardsAPI } from '@api/dashboardsAPI'
import { reportingsAPI } from '@api/reportingsAPI'
import { sideWindowActions } from '@features/SideWindow/slice'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { generatePath } from 'react-router'

import { dashboardActions, initialDashboard } from '../slice'

import type { HomeAppThunk } from '@store/index'

export const editDashboard =
  (id): HomeAppThunk =>
  async (dispatch, getState) => {
    const dashboardToEdit = dashboardsAPI.endpoints.getDashboard
    const extractedArea = dashboardsAPI.endpoints.getExtratedArea

    // if dasbaord already open
    if (getState().dashboard.dashboards[id] === id) {
      dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.DASHBOARD, { id })))

      return
    }

    try {
      const dashboardRequest = dispatch(dashboardToEdit.initiate(id))
      const dashboardResponse = await dashboardRequest.unwrap()
      if (!dashboardResponse || !dashboardResponse.geom) {
        throw Error()
      }

      // TODO(17/10.24): use api to get reporting by ids when available
      const reportingsIds = dashboardResponse.reportings

      const reportings = await Promise.all(
        reportingsIds.map(async reportingId => {
          const reportingRequest = dispatch(reportingsAPI.endpoints.getReporting.initiate(reportingId))
          const reportingResponse = await reportingRequest.unwrap()

          return reportingResponse
        })
      )
      const extractedAreaRequest = dispatch(extractedArea.initiate(dashboardResponse.geom))
      const extractedAreaResponse = await extractedAreaRequest.unwrap()

      const formattedDashboard = {
        ...initialDashboard,
        dashboard: {
          ...dashboardResponse,
          reportings
        },
        extractedArea: extractedAreaResponse
      }

      dispatch(dashboardActions.editDashboard(formattedDashboard))
      dispatch(dashboardActions.setActiveDashboardId(dashboardResponse.id))
      dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.DASHBOARD, { id: dashboardResponse.id })))
    } catch (error) {
      dispatch(
        addSideWindowBanner({
          children: 'Un problème est survenu lors de la récupération du tableau de bord, veuillez réessayer',
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }
  }
