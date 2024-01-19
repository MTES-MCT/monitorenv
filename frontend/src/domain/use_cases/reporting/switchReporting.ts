import { mainWindowActions } from '../../../features/MainWindow/slice'
import { attachMissionToReportingSliceActions } from '../../../features/Reportings/slice'
import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'

export const switchReporting =
  (nextReportingId: number, reportingContext: ReportingContext) => async (dispatch, getState) => {
    const { reportings } = getState().reporting

    await dispatch(reportingActions.setActiveReportingId(nextReportingId))

    const nextReporting = reportings[nextReportingId]
    const hasAttachedMission =
      !!nextReporting.reporting.attachedMission && !nextReporting.reporting.detachedFromMissionAtUtc
    await dispatch(
      attachMissionToReportingSliceActions.setAttachedMission(
        hasAttachedMission ? nextReporting.reporting.attachedMission : undefined
      )
    )

    if (reportingContext === ReportingContext.MAP) {
      dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(true))
    }
    dispatch(
      setReportingFormVisibility({
        context: reportingContext,
        visibility: VisibilityState.VISIBLE
      })
    )
  }
