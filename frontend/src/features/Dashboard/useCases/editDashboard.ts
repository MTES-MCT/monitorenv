import { ampsAPI } from '@api/ampsAPI'
import { dashboardsAPI } from '@api/dashboardsAPI'
import { regulatoryLayersAPI } from '@api/regulatoryLayersAPI'
import { reportingsAPI } from '@api/reportingsAPI'
import { vigilanceAreasAPI } from '@api/vigilanceAreasAPI'
import { sideWindowActions } from '@features/SideWindow/slice'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { generatePath } from 'react-router'

import { dashboardActions, initialDashboard } from '../slice'
import { updateDashboardDatas } from '../utils'

import type { Dashboard } from '../types'
import type { HomeAppThunk } from '@store/index'

export const editDashboard =
  (id): HomeAppThunk =>
  async (dispatch, getState) => {
    // if dashboard is already open
    if (getState().dashboard.dashboards[id] === id) {
      dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.DASHBOARD, { id })))

      return
    }

    try {
      const { data: dashboard } = await dispatch(dashboardsAPI.endpoints.getDashboard.initiate(id))
      if (!dashboard?.geom) {
        throw Error()
      }

      // get dashboard datas
      const { data } = await dispatch(dashboardsAPI.endpoints.getExtratedArea.initiate(dashboard.geom))
      if (!data) {
        throw Error()
      }

      const filteredDashboard = updateDashboardDatas(dashboard, data)

      const { data: regulatoryLayers } = await dispatch(regulatoryLayersAPI.endpoints.getRegulatoryLayers.initiate())
      const { data: ampLayers } = await dispatch(ampsAPI.endpoints.getAMPs.initiate())
      const { data: vigilanceAreas } = await dispatch(vigilanceAreasAPI.endpoints.getVigilanceAreas.initiate())
      const { data: reportings } = await dispatch(reportingsAPI.endpoints.getReportingsByIds.initiate(data.reportings))
      const extractedArea: Dashboard.ExtractedArea = {
        ...data,
        amps: Object.values(ampLayers?.entities ?? []).filter(amp => data.amps.includes(amp.id)),
        regulatoryAreas: Object.values(regulatoryLayers?.entities ?? []).filter(reg =>
          data.regulatoryAreas.includes(reg.id)
        ),
        reportings: Object.values(reportings?.entities ?? []),
        vigilanceAreas: Object.values(vigilanceAreas?.entities ?? []).filter(vigilanceArea =>
          data.vigilanceAreas.includes(vigilanceArea.id)
        )
      }

      const formattedDashboard = {
        ...initialDashboard,
        dashboard: filteredDashboard,
        extractedArea
      }
      dispatch(dashboardActions.editDashboard(formattedDashboard))
      dispatch(dashboardActions.setActiveDashboardId(dashboard.id))
      dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.DASHBOARD, { id: dashboard.id })))
    } catch (error) {
      dispatch(
        addSideWindowBanner({
          children: 'Un problème est survenu lors de la récupération du tableau de bord, veuillez réessayer',
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }
  }
