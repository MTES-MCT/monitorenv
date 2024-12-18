import { setDisplayedItems } from 'domain/shared_slices/Global'
import { closeAreaOverlay } from 'domain/use_cases/map/closeAreaOverlay'

import type { HomeAppThunk } from '@store/index'

export const displayOrHideOtherLayers =
  ({ display, withInterestPoint = display }: { display: boolean; withInterestPoint?: boolean }): HomeAppThunk =>
  dispatch => {
    dispatch(
      setDisplayedItems({
        displayDashboardLayer: display,
        displayInterestPointLayer: withInterestPoint ?? display,
        displayMissionEditingLayer: display,
        displayMissionSelectedLayer: display,
        displayMissionsLayer: display,
        displayMissionToAttachLayer: display,
        displayReportingEditingLayer: display,
        displayReportingSelectedLayer: display,
        displayReportingsLayer: display,
        displayReportingToAttachLayer: display,
        displaySemaphoresLayer: display,
        displayVigilanceAreaLayer: display
      })
    )

    // close layer list overlay
    dispatch(closeAreaOverlay())
  }
