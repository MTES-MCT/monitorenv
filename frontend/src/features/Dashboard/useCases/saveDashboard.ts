import { dashboardsAPI } from '@api/dashboardsAPI'
import { RecentActivity } from '@features/RecentActivity/types'
import { sideWindowActions } from '@features/SideWindow/slice'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'
import { DateRangeEnum } from 'domain/entities/dateRange'
import { ReportingTypeEnum, StatusFilterEnum } from 'domain/entities/reporting'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { generatePath } from 'react-router'

import { dashboardFiltersActions } from '../components/DashboardForm/slice'
import { dashboardActions } from '../slice'

import type { Dashboard } from '../types'
import type { HomeAppThunk } from '@store/index'

export const SAVE_DASHBOARD_ERROR_MESSAGE = "Nous n'avons pas pu enregistrer le tableau de bord"

export const saveDashboard =
  (dashboard: Dashboard.Dashboard): HomeAppThunk =>
  async (dispatch, getState) => {
    const dashboardToSave: Dashboard.DashboardToApi = {
      ...dashboard,
      id: dashboard.createdAt ? dashboard.id : undefined
    }
    const { data, error } = await dispatch(dashboardsAPI.endpoints.save.initiate(dashboardToSave))
    const dashboardFilters = getState().dashboardFilters.dashboards[dashboard.id]

    if (data) {
      if (dashboard.createdAt) {
        dispatch(dashboardActions.updateDashboard({ dashboard: data }))
      } else {
        dispatch(dashboardActions.saveDashboard({ dashboard: data, unsavedDashboardId: dashboard.id }))

        const formattedDashboardFilters = {
          controlUnitFilters: dashboardFilters?.controlUnitFilters ?? {},
          filters: dashboardFilters?.filters ?? {},
          recentActivityFilters: dashboardFilters?.recentActivityFilters ?? {
            periodFilter: RecentActivity.RecentActivityDateRangeEnum.SEVEN_LAST_DAYS
          },
          reportingFilters: dashboardFilters?.reportingFilters ?? {
            dateRange: DateRangeEnum.MONTH,
            status: [StatusFilterEnum.IN_PROGRESS],
            type: ReportingTypeEnum.INFRACTION_SUSPICION
          }
        }
        dispatch(dashboardFiltersActions.setDashboardFilters({ filters: formattedDashboardFilters, id: data.id }))
        dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.DASHBOARD, { id: data.id })))
      }

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
