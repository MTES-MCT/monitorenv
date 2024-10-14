import { dashboardsAPI } from '@api/dashboardsAPI'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { sideWindowActions } from '@features/SideWindow/slice'
import { customDayjs, Level } from '@mtes-mct/monitor-ui'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { generatePath } from 'react-router'

import { dashboardActions } from '../slice'
import { closeDrawDashboard } from './closeDrawDashboard'

import type { HomeAppThunk } from '@store/index'
import type { GeoJSON } from 'domain/types/GeoJSON'

export const GET_EXTRACTED_AREAS_ERROR_MESSAGE = "Nous n'avons pas pu créer le tableau de bord"

export const createDashboard =
  (geometry: GeoJSON.Geometry): HomeAppThunk =>
  async (dispatch, getState) => {
    const { data, error } = await dispatch(dashboardsAPI.endpoints.getExtratedArea.initiate(geometry))
    if (data) {
      dispatch(closeDrawDashboard())
      const newId = `new-${Object.keys(getState().dashboard.dashboards).length}`
      const date = customDayjs().format('DD/MM/YYYY')
      const newDashboardName = `Tab ${date}`
      dispatch(dashboardActions.setName(newDashboardName))
      dispatch(dashboardActions.createDashboard({ extractedArea: data, geom: geometry, id: newId }))
      dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.DASHBOARD, { id: newId })))
    }
    if (error) {
      dispatch(
        addMainWindowBanner({
          children: GET_EXTRACTED_AREAS_ERROR_MESSAGE,
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }
  }
