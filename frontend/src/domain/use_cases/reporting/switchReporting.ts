import { mainWindowActions } from '../../../features/MainWindow/slice'
import { attachMissionToReportingSliceActions } from '../../../features/Reportings/slice'
import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'

import type { HomeAppThunk } from '@store/index'

export const switchReporting =
  (nextReportingId: number, reportingContext: ReportingContext): HomeAppThunk =>
  async (dispatch, getState) => {
    const { reportings } = getState().reporting

    dispatch(reportingActions.setActiveReportingId(nextReportingId))

    const nextReporting = reportings[nextReportingId]
    if (!nextReporting) {
      return
    }
    const hasAttachedMission =
      !!nextReporting.reporting.attachedMission && !nextReporting.reporting.detachedFromMissionAtUtc
    dispatch(
      attachMissionToReportingSliceActions.setAttachedMission(
        hasAttachedMission ? nextReporting.reporting.attachedMission : undefined
      )
    )
    dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(reportingContext === ReportingContext.MAP))
    dispatch(
      setReportingFormVisibility({
        context: reportingContext,
        visibility: VisibilityState.VISIBLE
      })
    )
  }
