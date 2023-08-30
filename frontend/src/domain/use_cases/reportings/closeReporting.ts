import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { reportingStateActions } from '../../shared_slices/ReportingState'

export const closeReporting = (id: number | string | undefined) => async (dispatch, getState) => {
  const {
    multiReportings: { selectedReportings },
    reportingState: { context, isFormDirty, reportingState }
  } = getState()
  if (!id) {
    return
  }

  const indexToClose = selectedReportings.findIndex(reporting => reporting.reporting.id === id)

  // if we want to close a reporting with a form that has changes
  if (
    selectedReportings[indexToClose]?.isFormDirty ||
    (selectedReportings.length === 1 && isFormDirty) ||
    (selectedReportings[indexToClose].reporting?.id === reportingState?.id && isFormDirty)
  ) {
    if (reportingState) {
      await saveCurrentReportingInMultiMissionsState(
        reportingState,
        context,
        selectedReportings,
        isFormDirty,
        dispatch,
        id
      )

      return
    }

    dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(true))

    return
  }

  await dispatch(multiReportingsActions.deleteSelectedReporting(id))
}

async function saveCurrentReportingInMultiMissionsState(
  reportingState,
  context,
  selectedReportings,
  isFormDirty,
  dispatch,
  id
) {
  const updatedReportings = [...selectedReportings]
  const reportingIndex = updatedReportings.findIndex(reporting => reporting.reporting.id === reportingState?.id)
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
  await dispatch(
    multiReportingsActions.setSelectedReportings({
      activeReportingId: id,
      selectedReportings: updatedReportings
    })
  )
  await dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(true))
}
