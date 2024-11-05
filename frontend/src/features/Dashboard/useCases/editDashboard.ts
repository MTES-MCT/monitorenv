import { dashboardsAPI } from '@api/dashboardsAPI'
import { sideWindowActions } from '@features/SideWindow/slice'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { generatePath } from 'react-router'

import { dashboardFiltersActions } from '../components/DashboardForm/slice'
import { dashboardActions, initialDashboard } from '../slice'
import { getPopulatedExtractedArea } from '../utils'

import type { HomeAppThunk } from '@store/index'

export const editDashboard =
  (id): HomeAppThunk =>
  async (dispatch, getState) => {
    const dashboardFilters = getState().dashboardFilters.dashboards[id]

    const openedDashboard = Object.entries(getState().dashboard.dashboards).find(
      ([key, dashboard]) => key === id || dashboard.dashboard.id === id
    )

    if (openedDashboard) {
      dispatch(dashboardActions.setActiveDashboardId(openedDashboard[0]))
      dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.DASHBOARD, { id: openedDashboard[0] })))
      dispatch(dashboardFiltersActions.setDashboardFilters({ filters: dashboardFilters, id }))

      return
    }

    try {
      const { data: dashboard } = await dispatch(dashboardsAPI.endpoints.getDashboard.initiate(id))
      if (!dashboard?.geom) {
        throw Error()
      }

      // get dashboard datas
      const { data } = await dispatch(dashboardsAPI.endpoints.getExtratedArea.initiate(dashboard.geom))
      if (!data) {
        throw Error()
      }

      const extractedArea = await getPopulatedExtractedArea(data, dispatch)

      const formattedDashboard = { ...initialDashboard, dashboard, extractedArea }
      dispatch(dashboardFiltersActions.setDashboardFilters({ filters: dashboardFilters, id }))
      dispatch(dashboardActions.editDashboard(formattedDashboard))
      dispatch(dashboardActions.setActiveDashboardId(id))
      dispatch(dashboardActions.setSelectedDashboardOnMap(undefined))
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
