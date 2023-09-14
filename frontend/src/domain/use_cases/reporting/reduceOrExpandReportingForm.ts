import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../shared_slices/Global'

export const reduceOrExpandReportingForm = (reportingContext: ReportingContext) => (dispatch, getState) => {
  const { reportingFormVisibility } = getState().global
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
