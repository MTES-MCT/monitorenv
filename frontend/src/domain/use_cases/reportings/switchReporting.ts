import { saveReportingInMultiReportingsState } from './saveReportingInMultiReportingsState'
import { setReportingFormVisibility } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { VisibilityState } from '../../shared_slices/ReportingState'

export const switchReporting = (nextReportingId, reportingContext) => async (dispatch, getState) => {
  const {
    multiReportings: { selectedReportings },
    reportingState: { reportingState }
  } = getState()

  let updatedReportings = [...selectedReportings]

  // We want to save the active form before switching on another
  if (reportingState) {
    updatedReportings = await dispatch(saveReportingInMultiReportingsState())
  }

  await dispatch(
    multiReportingsActions.setSelectedReportings({
      activeReportingId: nextReportingId,
      selectedReportings: updatedReportings
    })
  )

  dispatch(
    setReportingFormVisibility({
      context: reportingContext,
      visibility: VisibilityState.VISIBLE
    })
  )
}
