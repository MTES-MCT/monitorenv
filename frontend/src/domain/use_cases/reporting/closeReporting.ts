import { attachMissionToReportingSliceActions } from '../../../features/Reportings/ReportingForm/AttachMission/slice'
import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'
import { MapInteractionListenerEnum, updateMapInteractionListeners } from '../map/updateMapInteractionListeners'

export const closeReporting =
  (reportingIdToClose: number | string, reportingContextToClose: ReportingContext) => async (dispatch, getState) => {
    const { activeReportingId, reportings } = getState().reporting
    if (!reportingIdToClose) {
      return
    }

    if (reportings[reportingIdToClose].isFormDirty) {
      await dispatch(reportingActions.setReporting(reportings[reportingIdToClose]))
      await dispatch(reportingActions.setActiveReportingId(reportingIdToClose))
      await dispatch(
        attachMissionToReportingSliceActions.setAttachedMission(
          reportings[reportingIdToClose].reporting.attachedMission
        )
      )
      await dispatch(
        attachMissionToReportingSliceActions.setMissionId(reportings[reportingIdToClose].reporting.missionId)
      )
      await dispatch(reportingActions.setIsConfirmCancelDialogVisible(true))
      await dispatch(
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
    await dispatch(
      setReportingFormVisibility({
        context: reportingContextToClose,
        visibility: VisibilityState.NONE
      })
    )
  }
