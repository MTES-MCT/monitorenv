import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'

export const closeReporting =
  (reportingIdToClose: number | string, reportingContextToClose: ReportingContext) => async (dispatch, getState) => {
    const { reportings } = getState().reporting
    if (!reportingIdToClose) {
      return
    }

    if (reportings[reportingIdToClose].isFormDirty) {
      await dispatch(reportingActions.setReporting(reportings[reportingIdToClose]))
      await dispatch(reportingActions.setActiveReportingId(reportingIdToClose))

      await dispatch(reportingActions.setIsConfirmCancelDialogVisible(true))
      await dispatch(
        setReportingFormVisibility({
          context: reportingContextToClose,
          visibility: VisibilityState.VISIBLE
        })
      )

      return
    }

    await dispatch(reportingActions.deleteSelectedReporting(reportingIdToClose))
    await dispatch(
      setReportingFormVisibility({
        context: reportingContextToClose,
        visibility: VisibilityState.NONE
      })
    )
  }
