import { setDisplayedItems } from 'domain/shared_slices/Global'
import { closeAreaOverlay } from 'domain/use_cases/map/closeAreaOverlay'

import type { HomeAppThunk } from '@store/index'

export const hideLayers =
  (options?: { keepInterestPoint?: boolean }): HomeAppThunk =>
  dispatch => {
    dispatch(
      setDisplayedItems({
        layers: {
          displayDashboardLayer: false,
          displayInterestPointLayer: options?.keepInterestPoint,
          displayMissionEditingLayer: false,
          displayMissionSelectedLayer: false,
          displayMissionsLayer: false,
          displayMissionToAttachLayer: false,
          displayReportingEditingLayer: false,
          displayReportingSelectedLayer: false,
          displayReportingsLayer: false,
          displayReportingToAttachLayer: false,
          displaySemaphoresLayer: false,
          displayStationLayer: false,
          displayVigilanceAreaLayer: false
        }
      })
    )

    // close layer list overlay
    dispatch(closeAreaOverlay())
  }
