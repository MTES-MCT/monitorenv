import { setReportingFormVisibility, ReportingContext, VisibilityState } from 'domain/shared_slices/Global'

import { mainWindowActions } from '../../MainWindow/slice'

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
    dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
  }
}
