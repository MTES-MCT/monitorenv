import { dashboardsAPI } from '@api/dashboardsAPI'
import { sideWindowActions } from '@features/SideWindow/slice'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { setToast } from 'domain/shared_slices/Global'
import { generatePath } from 'react-router'

import { dashboardActions } from '../slice'
import { bannerClosingDelay } from '../utils'

import type { Dashboard } from '../types'
import type { HomeAppThunk } from '@store/index'

export const SAVE_DASHBOARD_ERROR_MESSAGE = "Nous n'avons pas pu enregistrer le tableau de bord"

export const saveDashboard =
  (dashboard: Dashboard.DashboardToApi): HomeAppThunk =>
  async dispatch => {
    const { data, error } = await dispatch(dashboardsAPI.endpoints.save.initiate(dashboard))
    if (data) {
      dispatch(dashboardActions.updateDashboard({ dashboard: data }))
      dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.DASHBOARD, { id: data.id })))
      dispatch(dashboardActions.setBanner(true))
      setTimeout(() => {
        dispatch(dashboardActions.setBanner(false))
      }, bannerClosingDelay)
    }
    if (error) {
      dispatch(setToast({ containerId: 'sideWindow', message: SAVE_DASHBOARD_ERROR_MESSAGE }))
    }
  }
