import { mainWindowActions } from '../../../features/MainWindow/slice'
import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../shared_slices/Global'

import type { HomeAppThunk } from '../../../store'

export const reduceReportingFormOnMap = (): HomeAppThunk => (dispatch, getState) => {
  const { reportingFormVisibility } = getState().global
  if (
    reportingFormVisibility.context === ReportingContext.MAP &&
    reportingFormVisibility.visibility !== VisibilityState.NONE
  ) {
    dispatch(
      setReportingFormVisibility({
        context: ReportingContext.MAP,
        visibility: VisibilityState.REDUCED
      })
    )
    dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(true))
  }
}
