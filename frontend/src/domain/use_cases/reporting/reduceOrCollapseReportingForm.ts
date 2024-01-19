import { mainWindowActions } from '../../../features/MainWindow/slice'
import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../shared_slices/Global'

export const reduceOrCollapseReportingForm = (reportingContext: ReportingContext) => (dispatch, getState) => {
  const { reportingFormVisibility } = getState().global
  if (reportingContext === ReportingContext.MAP) {
    dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(true))
  }
  if (reportingFormVisibility.visibility === VisibilityState.VISIBLE) {
    dispatch(
      setReportingFormVisibility({
        context: reportingContext,
        visibility: VisibilityState.REDUCED
      })
    )
  } else {
    dispatch(
      setReportingFormVisibility({
        context: reportingContext,
        visibility: VisibilityState.VISIBLE
      })
    )
  }
}
