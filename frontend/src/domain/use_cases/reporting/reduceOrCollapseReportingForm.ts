import { mainWindowActions } from '../../../features/MainWindow/slice'
import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../shared_slices/Global'

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
