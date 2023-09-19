import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../shared_slices/Global'

export const reduceReportingFormOnMap = () => (dispatch, getState) => {
  const { reportingFormVisibility } = getState().global
  if (reportingFormVisibility.context === ReportingContext.MAP && reportingFormVisibility !== VisibilityState.NONE) {
    dispatch(
      setReportingFormVisibility({
        context: ReportingContext.MAP,
        visibility: VisibilityState.REDUCED
      })
    )
  }
}
