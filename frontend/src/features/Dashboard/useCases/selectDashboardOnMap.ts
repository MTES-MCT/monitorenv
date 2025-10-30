import { ampsAPI } from '@api/ampsAPI'
import { regulatoryLayersAPI } from '@api/regulatoryLayersAPI'
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
      const { data: reportings } =
        dashboard.reportingIds.length > 0
          ? await dispatch(reportingsAPI.endpoints.getReportingsByIds.initiate(dashboard.reportingIds))
          : { data: { entities: [] } }

      const { data: amps } =
        dashboard.ampIds.length > 0
          ? await dispatch(ampsAPI.endpoints.getAmpsByIds.initiate(dashboard.ampIds))
          : { data: [] }

      const { data: regulatoryAreas } =
        dashboard.regulatoryAreaIds.length > 0
          ? await dispatch(regulatoryLayersAPI.endpoints.getRegulatoryAreasByIds.initiate(dashboard.regulatoryAreaIds))
          : { data: [] }
      const { data: vigilanceAreas } =
        dashboard.vigilanceAreaIds.length > 0
          ? await dispatch(vigilanceAreasAPI.endpoints.getVigilanceAreasByIds.initiate(dashboard.vigilanceAreaIds))
          : { data: [] }
      dispatch(
        dashboardActions.setSelectedDashboardOnMap({
          ...dashboard,
          amps: amps ?? [],
          regulatoryAreas: regulatoryAreas ?? [],
          reportings: Object.values(reportings?.entities ?? []),
          vigilanceAreas: vigilanceAreas ?? []
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
