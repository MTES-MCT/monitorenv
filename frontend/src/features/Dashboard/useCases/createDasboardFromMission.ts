import { dashboardsAPI } from '@api/dashboardsAPI'
import { sideWindowActions } from '@features/SideWindow/slice'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { customDayjs, Level } from '@mtes-mct/monitor-ui'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { generatePath } from 'react-router'

import { dashboardFiltersActions, INITIAL_DASHBOARD_FILTERS } from '../components/DashboardForm/slice'
import { dashboardActions } from '../slice'
import { populateExtractAreaFromApi } from '../utils'

import type { Dashboard } from '../types'
import type { HomeAppThunk } from '@store/index'
import type { TagOption } from 'domain/entities/tags'
import type { GeoJSON } from 'domain/types/GeoJSON'

export const GET_EXTRACTED_AREAS_ERROR_MESSAGE = "Nous n'avons pas pu créer le tableau de bord"

type DashboardToCreateType = {
  controlUnitIds: number[]
  geom: GeoJSON.Geometry
  tags?: TagOption[]
}
export const createDashboardFromMission =
  (dashboardToCreate: DashboardToCreateType): HomeAppThunk =>
  async (dispatch, getState) => {
    try {
      const { data, error } = await dispatch(dashboardsAPI.endpoints.getExtratedArea.initiate(dashboardToCreate.geom))
      if (data) {
        const newId = `new-${Object.keys(getState().dashboard.dashboards).length}`
        const newDashboardName = `Tab ${customDayjs().format('DD/MM/YYYY')}`
        const dashboard: Dashboard.Dashboard = {
          ampIds: [],
          controlUnitIds: dashboardToCreate.controlUnitIds,
          geom: dashboardToCreate.geom,
          id: newId,
          images: [],
          inseeCode: data.inseeCode,
          links: [],
          name: newDashboardName,
          regulatoryAreaIds: [],
          reportingIds: [],
          vigilanceAreaIds: []
        }

        const formattedDashboardFilters = {
          ...INITIAL_DASHBOARD_FILTERS,
          filters: {
            regulatoryTags: dashboardToCreate.tags
          }
        }

        const extractedArea = await populateExtractAreaFromApi(dispatch, data)
        dispatch(dashboardFiltersActions.setDashboardFilters({ filters: formattedDashboardFilters, id: newId }))
        dispatch(dashboardActions.createDashboard({ dashboard, defaultName: newDashboardName, extractedArea }))
        dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.DASHBOARD, { id: newId })))
      }

      if (error) {
        throw new Error()
      }
    } catch (error) {
      dispatch(
        addSideWindowBanner({
          children: GET_EXTRACTED_AREAS_ERROR_MESSAGE,
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }
  }
