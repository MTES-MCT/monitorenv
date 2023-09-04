import { setReportingFormVisibility } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { ReportingContext, VisibilityState, reportingStateActions } from '../../shared_slices/ReportingState'

export const closeReporting =
  (reportingIdToClose: number | string | undefined, reportingContextToClose: ReportingContext) =>
  async (dispatch, getState) => {
    const {
      multiReportings: { selectedReportings },
      reportingState: { context, isFormDirty, reportingState }
    } = getState()
    if (!reportingIdToClose) {
      return
    }

    const indexToClose = selectedReportings.findIndex(reporting => reporting.reporting.id === reportingIdToClose)

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
          reportingIdToClose
        )

        await dispatch(
          setReportingFormVisibility({
            context,
            visibility: VisibilityState.VISIBLE
          })
        )
        await dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(true))

        return
      }
    }

    await dispatch(multiReportingsActions.deleteSelectedReporting(reportingIdToClose))
    await dispatch(
      setReportingFormVisibility({
        context: reportingContextToClose,
        visibility: VisibilityState.NONE
      })
    )
  }

async function saveCurrentReportingInMultiMissionsState(
  reportingState,
  context,
  selectedReportings,
  isFormDirty,
  dispatch,
  reportingIdToClose
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
      activeReportingId: reportingIdToClose,
      selectedReportings: updatedReportings
    })
  )
}
