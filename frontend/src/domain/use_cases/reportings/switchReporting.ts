import { getIdTyped } from '../../../utils/getIdTyped'
import { setReportingFormVisibility } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { ReportingFormVisibility } from '../../shared_slices/ReportingState'

export const switchReporting = nextReportingId => async (dispatch, getState) => {
  const {
    multiReportings: { selectedReportings },
    reportingState: { context, isFormDirty, reportingState }
  } = getState()

  const id = getIdTyped(nextReportingId)

  const updatedReportings = [...selectedReportings]
  const reportingIndex = updatedReportings.findIndex(reporting =>
    reportingState ? reporting.reporting.id === reportingState?.id : reporting.reporting.id === id
  )

  // We want to save the active form before switching on another
  if (reportingState && selectedReportings.length > 0) {
    const formattedReporting = {
      context,
      isFormDirty,
      reporting: reportingState
    }
    if (reportingIndex !== -1) {
      updatedReportings[reportingIndex] = formattedReporting
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
  dispatch(setReportingFormVisibility(ReportingFormVisibility.VISIBLE))
}
