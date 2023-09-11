import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'

export const switchReporting = (nextReportingId: number, reportingContext: ReportingContext) => async dispatch => {
  dispatch(multiReportingsActions.setActiveReportingId(nextReportingId))

  dispatch(
    setReportingFormVisibility({
      context: reportingContext,
      visibility: VisibilityState.VISIBLE
    })
  )
}
