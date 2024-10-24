import { dashboardsAPI } from '@api/dashboardsAPI'
import { sideWindowActions } from '@features/SideWindow/slice'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { customDayjs, Level } from '@mtes-mct/monitor-ui'
import { sideWindowPaths } from 'domain/entities/sideWindow'
import { generatePath } from 'react-router'

import { dashboardActions } from '../slice'
import { populateExtractAreaFromApi } from '../utils'
import { closeDrawDashboard } from './closeDrawDashboard'

import type { HomeAppThunk } from '@store/index'
import type { GeoJSON } from 'domain/types/GeoJSON'

export const GET_EXTRACTED_AREAS_ERROR_MESSAGE = "Nous n'avons pas pu créer le tableau de bord"

export const createDashboard =
  (geometry: GeoJSON.Geometry): HomeAppThunk =>
  async (dispatch, getState) => {
    try {
      const { data, error } = await dispatch(dashboardsAPI.endpoints.getExtratedArea.initiate(geometry))
      if (data) {
        dispatch(closeDrawDashboard())
        const newId = `new-${Object.keys(getState().dashboard.dashboards).length}`
        const newDashboardName = `Tab ${customDayjs().format('DD/MM/YYYY')}`
        const dashboard = {
          ampIds: [],
          controlUnitIds: [],
          geom: geometry,
          id: newId,
          inseeCode: data.inseeCode,
          name: newDashboardName,
          regulatoryAreaIds: [],
          reportingIds: [],
          vigilanceAreaIds: []
        }
        const extractedArea = await populateExtractAreaFromApi(dispatch, data)
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
