import { mainWindowActions } from '@features/MainWindow/slice'
import { attachMissionToReportingSliceActions } from '@features/Reportings/components/ReportingForm/AttachMission/slice'
import { reportingActions } from '@features/Reportings/slice'

import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../../domain/shared_slices/Global'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from '../../../domain/use_cases/map/updateMapInteractionListeners'

export const closeReporting =
  (reportingIdToClose: number | string, reportingContextToClose: ReportingContext) => async (dispatch, getState) => {
    const { activeReportingId, reportings } = getState().reporting
    if (!reportingIdToClose) {
      return
    }

    if (reportings[reportingIdToClose].isFormDirty) {
      const reportingToClose = reportings[reportingIdToClose]
      await dispatch(reportingActions.setReporting(reportingToClose))
      await dispatch(reportingActions.setActiveReportingId(reportingIdToClose))

      const hasAttachedMission =
        !!reportingToClose.reporting.attachedMission && !reportingToClose.reporting.detachedFromMissionAtUtc
      await dispatch(
        attachMissionToReportingSliceActions.setAttachedMission(
          hasAttachedMission ? reportings[reportingIdToClose].reporting.attachedMission : undefined
        )
      )

      dispatch(reportingActions.setIsConfirmCancelDialogVisible(true))
      if (reportingContextToClose === ReportingContext.MAP) {
        dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(true))
      }
      dispatch(
        setReportingFormVisibility({
          context: reportingContextToClose,
          visibility: VisibilityState.VISIBLE
        })
      )

      return
    }

    if (activeReportingId === reportingIdToClose) {
      await dispatch(attachMissionToReportingSliceActions.resetAttachMissionState())
    }
    await dispatch(reportingActions.deleteSelectedReporting(reportingIdToClose))
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
    if (reportingContextToClose === ReportingContext.MAP) {
      dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
    }
    dispatch(
      setReportingFormVisibility({
        context: reportingContextToClose,
        visibility: VisibilityState.NONE
      })
    )
  }
