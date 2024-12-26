import { dashboardsAPI } from '@api/dashboardsAPI'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { generatePath } from 'react-router'

import { closeTab } from './closeTab'
import { dashboardFiltersActions } from '../components/DashboardForm/slice'

import type { Dashboard } from '../types'
import type { HomeAppThunk } from '@store/index'

export const DELETE_DASHBOARD_ERROR_MESSAGE = "Nous n'avons pas pu supprimer le tableau de bord"

export const deleteDashboard =
  (key: string, dashboard: Dashboard.Dashboard): HomeAppThunk =>
  async dispatch => {
    const { id } = dashboard
    if (dashboard.createdAt) {
      try {
        await dispatch(dashboardsAPI.endpoints.delete.initiate(id))
        dispatch(dashboardFiltersActions.deleteDashboardFilters({ id: key }))
      } catch (error) {
        dispatch(
          addSideWindowBanner({
            children: DELETE_DASHBOARD_ERROR_MESSAGE,
            isClosable: true,
            isFixed: true,
            level: Level.ERROR,
            withAutomaticClosing: true
          })
        )
      }
    }
    dispatch(closeTab(generatePath(sideWindowPaths.DASHBOARD, { id: key })))
  }
