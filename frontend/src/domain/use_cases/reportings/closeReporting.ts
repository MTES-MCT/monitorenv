import { saveReportingInMultiReportingsState } from './saveReportingInMultiReportingsState'
import { setReportingFormVisibility } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { ReportingContext, VisibilityState, reportingStateActions } from '../../shared_slices/ReportingState'

export const closeReporting =
  (reportingIdToClose: number | string | undefined, reportingContextToClose: ReportingContext) =>
  async (dispatch, getState) => {
    const {
      multiReportings: { selectedReportings },
      reportingState: { isFormDirty, reportingState }
    } = getState()
    if (!reportingIdToClose) {
      return
    }
    const indexToClose = selectedReportings.findIndex(reporting => reporting.reporting.id === reportingIdToClose)

    const isFormHasChanges =
      selectedReportings[indexToClose]?.isFormDirty ||
      (selectedReportings.length === 1 && isFormDirty) ||
      (selectedReportings[indexToClose].reporting?.id === reportingState?.id && isFormDirty)

    // if we want to close a reporting with a form that has changes
    if (isFormHasChanges) {
      let updatedReportings = [...selectedReportings]
      if (reportingState) {
        updatedReportings = await dispatch(saveReportingInMultiReportingsState())
      }
      await dispatch(
        multiReportingsActions.setSelectedReportings({
          activeReportingId: reportingIdToClose,
          selectedReportings: updatedReportings
        })
      )
      await dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(true))
      await dispatch(
        setReportingFormVisibility({
          context: reportingContextToClose,
          visibility: VisibilityState.VISIBLE
        })
      )

      return
    }

    await dispatch(multiReportingsActions.deleteSelectedReporting(reportingIdToClose))
    await dispatch(
      setReportingFormVisibility({
        context: reportingContextToClose,
        visibility: VisibilityState.NONE
      })
    )
  }
