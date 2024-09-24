import { dashboardsAPI } from '@api/dashboardsAPI'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { sideWindowActions } from '@features/SideWindow/slice'
import { Level } from '@mtes-mct/monitor-ui'
import { sideWindowPaths } from 'domain/entities/sideWindow'

import { closeDashboard } from './closeDashboard'
import { dashboardActions } from '../slice'

import type { HomeAppThunk } from '@store/index'
import type { GeoJSON } from 'domain/types/GeoJSON'

export const GET_EXTRACTED_AREAS_ERROR_MESSAGE = "Nous n'avons pas pu créer le tableau de bord"

export const createDashboard =
  (geometry: GeoJSON.Geometry): HomeAppThunk =>
  async dispatch => {
    const { data, error } = await dispatch(dashboardsAPI.endpoints.getExtratedArea.initiate(geometry))
    if (data) {
      dispatch(closeDashboard())
      dispatch(dashboardActions.setExtractedArea(data))
      dispatch(sideWindowActions.focusAndGoTo(sideWindowPaths.DASHBOARD))
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
