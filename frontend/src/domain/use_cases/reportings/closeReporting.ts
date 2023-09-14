import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'

export const closeReporting =
  (reportingIdToClose: number | string, reportingContextToClose: ReportingContext) => async (dispatch, getState) => {
    const {
      multiReportings: { selectedReportings }
    } = getState()
    if (!reportingIdToClose) {
      return
    }

    if (selectedReportings[reportingIdToClose].isFormDirty) {
      await dispatch(multiReportingsActions.setReporting(selectedReportings[reportingIdToClose]))
      await dispatch(multiReportingsActions.setActiveReportingId(reportingIdToClose))

      await dispatch(multiReportingsActions.setIsConfirmCancelDialogVisible(true))
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
