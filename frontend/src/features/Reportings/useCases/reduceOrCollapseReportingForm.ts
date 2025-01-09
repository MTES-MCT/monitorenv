import { setReportingFormVisibility, ReportingContext, VisibilityState } from 'domain/shared_slices/Global'

import { mainWindowActions } from '../../MainWindow/slice'

export const reduceOrCollapseReportingForm = (reportingContext: ReportingContext) => (dispatch, getState) => {
  const { reportingFormVisibility } = getState().global
  const newVisibility =
    reportingFormVisibility.visibility === VisibilityState.VISIBLE ? VisibilityState.REDUCED : VisibilityState.VISIBLE
  dispatch(
    setReportingFormVisibility({
      context: reportingContext,
      visibility: newVisibility
    })
  )

  if (reportingContext === ReportingContext.MAP) {
    dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
  }
}
