import { setReportingFormVisibility } from '../shared_slices/Global'
import { ReportingContext, VisibilityState } from '../shared_slices/ReportingState'

export const reduceReportingForm = () => (dispatch, getState) => {
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
