import { mainWindowActions } from '../../../features/MainWindow/slice'
import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../shared_slices/Global'

export const reduceOrCollapseReportingForm = (reportingContext: ReportingContext) => (dispatch, getState) => {
  const { reportingFormVisibility } = getState().global
  if (reportingFormVisibility.visibility === VisibilityState.VISIBLE) {
    if (reportingContext === ReportingContext.MAP) {
      dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
    }
    dispatch(
      setReportingFormVisibility({
        context: reportingContext,
        visibility: VisibilityState.REDUCED
      })
    )
  } else {
    if (reportingContext === ReportingContext.MAP) {
      dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(true))
    }
    dispatch(
      setReportingFormVisibility({
        context: reportingContext,
        visibility: VisibilityState.VISIBLE
      })
    )
  }
}
