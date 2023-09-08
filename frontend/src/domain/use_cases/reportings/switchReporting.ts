import { setReportingFormVisibility } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { ReportingContext, VisibilityState } from '../../shared_slices/ReportingState'

export const switchReporting = (nextReportingId: number, reportingContext: ReportingContext) => async dispatch => {
  await dispatch(multiReportingsActions.setActiveReportingId(nextReportingId))

  dispatch(
    setReportingFormVisibility({
      context: reportingContext,
      visibility: VisibilityState.VISIBLE
    })
  )
}
