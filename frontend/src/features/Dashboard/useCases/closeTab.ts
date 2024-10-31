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
      dispatch(dashboardActions.removeTab(id))
      if (id === activeDashboardId) {
        dispatch(sideWindowActions.setCurrentPath(generatePath(sideWindowPaths.DASHBOARDS)))
      }
    }
  }
