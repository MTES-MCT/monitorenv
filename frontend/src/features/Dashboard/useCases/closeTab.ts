import { sideWindowActions } from '@features/SideWindow/slice'
import { getDashboardPageRoute } from '@utils/routes'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { generatePath } from 'react-router'

import { dashboardActions } from '../slice'

import type { HomeAppThunk } from '@store/index'

export const closeTab =
  (path: string): HomeAppThunk =>
  (dispatch, getState) => {
    const { activeDashboardId } = getState().dashboard
    const routeParams = getDashboardPageRoute(path)
    const id = routeParams?.params.id

    if (id) {
      const dashboard = getState().dashboard.dashboards[id]?.dashboard
      const unsavedDashboard = getState().dashboard.dashboards[id]?.unsavedDashboard
      if (dashboard !== unsavedDashboard) {
        dispatch(dashboardActions.setIsCancelModalOpen({ isCancelModalOpen: true, key: id }))

        return
      }
      dispatch(dashboardActions.removeTab(id))
      if (id === activeDashboardId) {
        dispatch(sideWindowActions.setCurrentPath(generatePath(sideWindowPaths.DASHBOARDS)))
      }
    }
  }
