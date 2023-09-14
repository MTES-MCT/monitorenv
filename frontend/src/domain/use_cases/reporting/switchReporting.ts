import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'

export const switchReporting = (nextReportingId: number, reportingContext: ReportingContext) => async dispatch => {
  dispatch(reportingActions.setActiveReportingId(nextReportingId))

  dispatch(
    setReportingFormVisibility({
      context: reportingContext,
      visibility: VisibilityState.VISIBLE
    })
  )
}
