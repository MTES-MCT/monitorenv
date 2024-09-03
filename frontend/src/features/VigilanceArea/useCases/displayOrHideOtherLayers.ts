import { setDisplayedItems } from 'domain/shared_slices/Global'
import { closeLayerListPopUp } from 'domain/use_cases/map/closeLayerListPopUp'

import type { HomeAppThunk } from '@store/index'

export const displayOrHideOtherLayers =
  ({ display }: { display: boolean }): HomeAppThunk =>
  dispatch => {
    dispatch(
      setDisplayedItems({
        displayInterestPointLayer: display,
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
    dispatch(closeLayerListPopUp())
  }
