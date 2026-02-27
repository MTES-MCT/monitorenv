import { ampsAPI } from '@api/ampsAPI'
import { regulatoryAreasAPI } from '@api/regulatoryAreasAPI'
import { reportingsAPI } from '@api/reportingsAPI'
import { vigilanceAreasAPI } from '@api/vigilanceAreasAPI'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { Level } from '@mtes-mct/monitor-ui'

import { dashboardActions } from '../slice'

import type { Dashboard } from '../types'
import type { HomeAppThunk } from '@store/index'

export const selectDashboardOnMap =
  (dashboard: Dashboard.DashboardFromApi): HomeAppThunk =>
  async dispatch => {
    // get dashboard datas
    try {
      const { data: reportings } = await dispatch(
        reportingsAPI.endpoints.getReportingsByIds.initiate(dashboard.reportingIds)
      )
      const { data: amps } = await dispatch(ampsAPI.endpoints.getAMPs.initiate())

      const { data: regulatoryAreas } = await dispatch(
        regulatoryAreasAPI.endpoints.getRegulatoryAreasByIds.initiate(dashboard.regulatoryAreaIds)
      )
      const { data: vigilanceAreas } = await dispatch(vigilanceAreasAPI.endpoints.getVigilanceAreas.initiate())

      const filteredAmps = Object.values(amps?.entities ?? []).filter(amp => dashboard.ampIds.includes(amp.id))

      const filteredVigilanceAreas = Object.values(vigilanceAreas?.entities ?? []).filter(vigilanceArea =>
        dashboard.vigilanceAreaIds.includes(vigilanceArea.id)
      )
      dispatch(
        dashboardActions.setSelectedDashboardOnMap({
          ...dashboard,
          amps: filteredAmps,
          regulatoryAreas: regulatoryAreas ?? [],
          reportings: Object.values(reportings?.entities ?? []),
          vigilanceAreas: filteredVigilanceAreas
        })
      )
    } catch (error) {
      dispatch(
        addSideWindowBanner({
          children: 'Un problème est survenu lors de la sélection du tableau de bord',
          isClosable: true,
          isFixed: true,
          level: Level.ERROR,
          withAutomaticClosing: true
        })
      )
    }
  }
