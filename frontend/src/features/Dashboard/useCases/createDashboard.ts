import { dashboardsAPI } from '@api/dashboardsAPI'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'

import { dashboardActions } from '../slice'

import type { HomeAppThunk } from '@store/index'
import type { GeoJSON } from 'domain/types/GeoJSON'

export const createDashboard =
  (geometry: GeoJSON.Geometry): HomeAppThunk =>
  async dispatch => {
    const { data } = await dispatch(dashboardsAPI.endpoints.getExtratedArea.initiate(geometry))
    if (data) {
      dispatch(dashboardActions.setExtractedArea(data))
    } else {
      dispatch(
        addMainWindowBanner({
          children: `Une erreur est survenue lors de la création du tableau de bord.`,
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }
  }
