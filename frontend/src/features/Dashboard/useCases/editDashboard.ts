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
    // if dasbaord already open
    if (getState().dashboard.dashboards[id] === id) {
      dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.DASHBOARD, { id })))

      return
    }

    try {
      const { data: dashboard } = await dispatch(dashboardsAPI.endpoints.getDashboard.initiate(id))
      if (!dashboard || !dashboard.geom) {
        throw Error()
      }

      // get reportings
      // TODO(17/10.24): use api to get reporting by ids when available
      const reportingsIds = dashboard.reportings
      const reportings = await Promise.all(
        reportingsIds.map(async reportingId => {
          const { data: reporting } = await dispatch(reportingsAPI.endpoints.getReporting.initiate(reportingId))
          if (!reporting) {
            throw Error()
          }

          return reporting
        })
      )

      // geta dashboardData
      const { data: extractedArea } = await dispatch(dashboardsAPI.endpoints.getExtratedArea.initiate(dashboard.geom))
      if (!extractedArea) {
        throw Error()
      }

      const formattedDashboard = {
        ...initialDashboard,
        dashboard: {
          ...dashboard,
          reportings
        },
        extractedArea
      }

      dispatch(dashboardActions.editDashboard(formattedDashboard))
      dispatch(dashboardActions.setActiveDashboardId(dashboard.id))
      dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.DASHBOARD, { id: dashboard.id })))
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
