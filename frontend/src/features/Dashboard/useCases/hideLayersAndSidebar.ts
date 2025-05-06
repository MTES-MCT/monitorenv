import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { setDisplayedItems } from 'domain/shared_slices/Global'
import { closeAreaOverlay } from 'domain/use_cases/map/closeAreaOverlay'

import type { HomeAppThunk } from '@store/index'

export const hideLayersAndSidebar = (): HomeAppThunk => (dispatch, getState) => {
  const { editingVigilanceAreaId } = getState().vigilanceArea

  dispatch(
    setDisplayedItems({
      layers: {
        displayDashboardLayer: false,
        displayInterestPointLayer: false,
        displayMissionEditingLayer: false,
        displayMissionSelectedLayer: false,
        displayMissionsLayer: false,
        displayMissionToAttachLayer: false,
        displayRecentActivityLayer: false,
        displayReportingEditingLayer: false,
        displayReportingSelectedLayer: false,
        displayReportingsLayer: false,
        displayReportingToAttachLayer: false,
        displaySemaphoresLayer: false,
        displayStationLayer: false,
        displayVigilanceAreaLayer: false
      },
      visibility: {
        isLayersSidebarVisible: false
      }
    })
  )
  if (!editingVigilanceAreaId) {
    dispatch(vigilanceAreaActions.resetState())
  }
  dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(editingVigilanceAreaId))
  dispatch(closeAreaOverlay())
}
