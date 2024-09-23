import { dashboardsAPI } from '@api/dashboardsAPI'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'

import type { HomeAppThunk } from '@store/index'
import type { GeoJSON } from 'domain/types/GeoJSON'
import type { Geometry } from 'ol/geom'

export const generateDashboard =
  (geometry: GeoJSON.Geometry): HomeAppThunk =>
  async dispatch => {
    try {
      const { data } = await dispatch(dashboardsAPI.endpoints.getExtratedArea.initiate(geometry))
      console.log(data)
    } catch (error) {
      dispatch(
        addMainWindowBanner({
          children: `Une erreur est survenue lors de la génération du tableau de bord.`,
          closingDelay: 10000,
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }
  }
