import { dashboardsAPI } from '@api/dashboardsAPI'
import { dashboardFiltersActions } from '@features/Dashboard/components/DashboardForm/slice'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'

import { dashboardActions } from '../slice'

import type { Dashboard } from '../types'
import type { HomeAppThunk } from '@store/index'

export const SAVE_DASHBOARD_ERROR_MESSAGE = "Nous n'avons pas pu enregistrer le tableau de bord"

export const saveDashboard =
  (key: string, dashboard: Dashboard.Dashboard): HomeAppThunk =>
  async (dispatch, getState) => {
    const dashboardToSave: Dashboard.DashboardToApi = {
      ...dashboard,
      id: dashboard.createdAt ? dashboard.id : undefined
    }
    const { data, error } = await dispatch(dashboardsAPI.endpoints.save.initiate(dashboardToSave))
    if (data) {
      dispatch(dashboardActions.updateDashboard({ dashboard: data }))
      dispatch(
        dashboardFiltersActions.setDashboardFilters({
          filters: getState().dashboardFilters.dashboards[key],
          id: data.id
        })
      )

      dispatch(
        addSideWindowBanner({
          children: 'Le tableau de bord a bien été enregistré',
          isClosable: true,
          isFixed: true,
          level: Level.SUCCESS,
          withAutomaticClosing: true
        })
      )
    }
    if (error) {
      dispatch(
        addSideWindowBanner({
          children: SAVE_DASHBOARD_ERROR_MESSAGE,
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }
  }
