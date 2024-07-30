import { mainWindowActions } from '../../../features/MainWindow/slice'
import { attachMissionToReportingSliceActions } from '../../../features/Reportings/slice'
import { getReportingInitialValues, createIdForNewReporting } from '../../../features/Reportings/utils'
import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'

import type { Reporting } from '../../entities/reporting'
import type { HomeAppThunk } from '@store/index'

export const addReporting =
  (reportingContext: ReportingContext, partialReporting?: Partial<Reporting> | undefined): HomeAppThunk =>
  async (dispatch, getState) => {
    const { reportings } = getState().reporting

    const id = createIdForNewReporting(reportings)

    const newReporting = {
      context: reportingContext,
      isFormDirty: false,
      reporting: getReportingInitialValues({ createdAt: new Date().toISOString(), id, ...partialReporting })
    }

    if (reportingContext === ReportingContext.MAP) {
      dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(true))
    }
    dispatch(
      setReportingFormVisibility({
        context: reportingContext,
        visibility: VisibilityState.VISIBLE
      })
    )

    dispatch(reportingActions.setReporting(newReporting))
    dispatch(reportingActions.setActiveReportingId(id))

    dispatch(attachMissionToReportingSliceActions.resetAttachMissionState())
  }
