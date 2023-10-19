import { attachMissionToReportingSliceActions } from '../../../features/Reportings/ReportingForm/AttachMission/slice'
import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'

export const switchReporting =
  (nextReportingId: number, reportingContext: ReportingContext) => async (dispatch, getState) => {
    const { reportings } = getState().reporting

    await dispatch(reportingActions.setActiveReportingId(nextReportingId))
    const nextReporting = reportings[nextReportingId]
    await dispatch(attachMissionToReportingSliceActions.setAttachedMission(nextReporting.reporting.attachedMission))
    await dispatch(attachMissionToReportingSliceActions.setMissionId(nextReporting.reporting.missionId))

    dispatch(
      setReportingFormVisibility({
        context: reportingContext,
        visibility: VisibilityState.VISIBLE
      })
    )
  }
