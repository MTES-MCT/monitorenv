import { attachMissionToReportingSliceActions } from '@features/Reportings/components/ReportingForm/AttachMission/slice'
import { reportingActions } from '@features/Reportings/slice'
import { setReportingFormVisibility, ReportingContext, VisibilityState } from 'domain/shared_slices/Global'

import { mainWindowActions } from '../../MainWindow/slice'

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

    dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(reportingContext === ReportingContext.MAP))
    dispatch(
      setReportingFormVisibility({
        context: reportingContext,
        visibility: VisibilityState.VISIBLE
      })
    )
  }
