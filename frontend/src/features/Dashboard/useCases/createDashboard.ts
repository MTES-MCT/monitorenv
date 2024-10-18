import { ampsAPI } from '@api/ampsAPI'
import { dashboardsAPI } from '@api/dashboardsAPI'
import { regulatoryLayersAPI } from '@api/regulatoryLayersAPI'
import { reportingsAPI } from '@api/reportingsAPI'
import { vigilanceAreasAPI } from '@api/vigilanceAreasAPI'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { sideWindowActions } from '@features/SideWindow/slice'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { customDayjs, Level } from '@mtes-mct/monitor-ui'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { generatePath } from 'react-router'

import { dashboardActions } from '../slice'
import { closeDrawDashboard } from './closeDrawDashboard'

import type { Dashboard } from '../types'
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
      const newDashboardName = `Tab ${customDayjs().format('DD/MM/YYYY')}`
      const dashboard = {
        amps: [],
        controlUnits: [],
        geom: geometry,
        id: newId,
        inseeCode: data.inseeCode,
        name: newDashboardName,
        regulatoryAreas: [],
        reportings: [],
        vigilanceAreas: []
      }
      const { data: regulatoryLayers } = await dispatch(regulatoryLayersAPI.endpoints.getRegulatoryLayers.initiate())
      const { data: ampLayers } = await dispatch(ampsAPI.endpoints.getAMPs.initiate())
      const { data: vigilanceAreas } = await dispatch(vigilanceAreasAPI.endpoints.getVigilanceAreas.initiate())
      const { data: reportings } = await dispatch(reportingsAPI.endpoints.getReportings.initiate())
      const extractedArea: Dashboard.ExtractedArea = {
        ...data,
        amps: Object.values(ampLayers?.entities ?? []).filter(amp => data.amps.includes(amp.id)),
        regulatoryAreas: Object.values(regulatoryLayers?.entities ?? []).filter(reg =>
          data.regulatoryAreas.includes(reg.id)
        ),
        reportings: Object.values(reportings?.entities ?? []).filter(reporting =>
          data.reportings.includes(+reporting.id)
        ),
        vigilanceAreas: Object.values(vigilanceAreas?.entities ?? []).filter(vigilanceArea =>
          data.vigilanceAreas.includes(vigilanceArea.id)
        )
      }
      dispatch(dashboardActions.createDashboard({ dashboard, defaultName: newDashboardName, extractedArea }))
      dispatch(sideWindowActions.focusAndGoTo(generatePath(sideWindowPaths.DASHBOARD, { id: newId })))
    }
    if (error) {
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
