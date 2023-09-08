import { setReportingFormVisibility } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { ReportingContext, VisibilityState } from '../../shared_slices/ReportingState'

import type { AppGetState } from '../../../store'

export const closeReporting =
  (reportingIdToClose: number | string | undefined, reportingContextToClose: ReportingContext) =>
  async (dispatch, getState: AppGetState) => {
    const {
      multiReportings: { activeReportingId, selectedReportings }
    } = getState()
    if (!reportingIdToClose) {
      return
    }
    const report = selectedReportings.find(reporting => reporting.reporting.id === activeReportingId)
    const reportingState = report?.reporting
    const isFormDirty = report?.isFormDirty

    const indexToClose = selectedReportings.findIndex(reporting => reporting.reporting.id === reportingIdToClose)

    const isFormHasChanges =
      selectedReportings[indexToClose]?.isFormDirty ||
      (selectedReportings.length === 1 && isFormDirty) ||
      (selectedReportings[indexToClose]?.reporting?.id === reportingState?.id && isFormDirty)

    // if we want to close a reporting with a form that has changes
    if (isFormHasChanges) {
      await dispatch(multiReportingsActions.setActiveReportingId(reportingIdToClose))
      // await dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(true))
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
