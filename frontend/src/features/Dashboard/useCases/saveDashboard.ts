import { dashboardsAPI } from '@api/dashboardsAPI'
import { setToast } from 'domain/shared_slices/Global'

import { dashboardActions } from '../slice'
import { bannerClosingDelay } from '../utils'

import type { Dashboard } from '../types'
import type { HomeAppThunk } from '@store/index'

export const SAVE_DASHBOARD_ERROR_MESSAGE = "Nous n'avons pas pu enregistrer le tableau de bord"

export const saveDashboard =
  (dashboard: Dashboard.Dashboard): HomeAppThunk =>
  async dispatch => {
    const dashboardToSave: Dashboard.DashboardToApi = {
      ...dashboard,
      id: dashboard.id?.includes('new-') ? undefined : dashboard.id,
      reportings: dashboard.reportings.map(reporting => +reporting.id)
    }
    const { data, error } = await dispatch(dashboardsAPI.endpoints.save.initiate(dashboardToSave))
    if (data) {
      dispatch(dashboardActions.updateDashboard({ dashboard: data }))
      dispatch(dashboardActions.setBanner(true))
      setTimeout(() => {
        dispatch(dashboardActions.setBanner(false))
      }, bannerClosingDelay)
    }
    if (error) {
      dispatch(setToast({ containerId: 'sideWindow', message: SAVE_DASHBOARD_ERROR_MESSAGE }))
    }
  }