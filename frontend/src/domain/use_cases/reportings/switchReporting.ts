import { setReportingFormVisibility } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { VisibilityState } from '../../shared_slices/ReportingState'

export const switchReporting = (nextReportingId, reportingContext) => async (dispatch, getState) => {
  const {
    multiReportings: { selectedReportings },
    reportingState: { context, isFormDirty, reportingState }
  } = getState()

  const updatedReportings = [...selectedReportings]

  // We want to save the active form before switching on another
  if (reportingState) {
    const reportingToSaveIndex = updatedReportings.findIndex(
      reporting => reportingState && reporting.reporting.id === reportingState?.id
    )
    const formattedReporting = {
      context,
      isFormDirty,
      reporting: reportingState
    }
    if (reportingToSaveIndex !== -1) {
      updatedReportings[reportingToSaveIndex] = formattedReporting
    } else {
      updatedReportings.push(formattedReporting)
    }
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
