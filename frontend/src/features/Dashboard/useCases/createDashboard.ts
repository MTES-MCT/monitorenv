import { dashboardsAPI } from '@api/dashboardsAPI'
import { sideWindowActions } from '@features/SideWindow/slice'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { customDayjs, Level } from '@mtes-mct/monitor-ui'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { generatePath } from 'react-router'

import { dashboardActions } from '../slice'
import { populateExtractAreaFromApi } from '../utils'
import { closeDrawDashboard } from './closeDrawDashboard'
import { dashboardFiltersActions, INITIAL_DASHBOARD_FILTERS } from '../components/DashboardForm/slice'

import type { Dashboard } from '../types'
import type { HomeAppThunk } from '@store/index'
import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'
import type { GeoJSON } from 'domain/types/GeoJSON'

export const GET_EXTRACTED_AREAS_ERROR_MESSAGE = "Nous n'avons pas pu créer le tableau de bord"

type DashboardToCreateType = {
  geom: GeoJSON.Geometry
  missionData?: {
    controlUnitIds?: number[]
    tags?: TagOption[]
    themes?: ThemeOption[]
  }
}

export const createDashboard =
  ({ geom, missionData }: DashboardToCreateType): HomeAppThunk =>
  async (dispatch, getState) => {
    try {
      const { data, error } = await dispatch(dashboardsAPI.endpoints.getExtratedArea.initiate(geom))
      if (data) {
        dispatch(closeDrawDashboard())
        const newId = `new-${Object.keys(getState().dashboard.dashboards).length}`
        const newDashboardName = `Tab ${customDayjs().format('DD/MM/YYYY')}`
        const dashboard: Dashboard.Dashboard = {
          ampIds: [],
          controlUnitIds: missionData?.controlUnitIds ?? [],
          geom,
          id: newId,
          images: [],
          inseeCode: data.inseeCode,
          links: [],
          name: newDashboardName,
          regulatoryAreaIds: [],
          reportingIds: [],
          vigilanceAreaIds: []
        }

        const extractedArea = await populateExtractAreaFromApi(dispatch, data)
        dispatch(dashboardActions.createDashboard({ dashboard, defaultName: newDashboardName, extractedArea }))
        dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.DASHBOARD, { id: newId })))

        if (missionData) {
          const filteredTags = missionData.tags?.filter(tag => data.tags?.some(t => t.id === tag.id))
          const filteredThemes = missionData.themes?.filter(theme => data.themes?.some(t => t.id === theme.id))

          const formattedDashboardFilters = {
            ...INITIAL_DASHBOARD_FILTERS,
            filters: {
              tags: filteredTags ?? [],
              themes: filteredThemes ?? []
            }
          }
          dispatch(
            dashboardFiltersActions.setDashboardFilters({ filters: formattedDashboardFilters, id: dashboard.id })
          )
        } else {
          dispatch(dashboardFiltersActions.createDashboardFilters({ id: newId }))
        }
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
