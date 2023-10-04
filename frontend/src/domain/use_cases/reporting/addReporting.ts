import { attachMissionToReportingSliceActions } from '../../../features/Reportings/ReportingForm/AttachMission/slice'
import { getReportingInitialValues, createIdForNewReporting } from '../../../features/Reportings/utils'
import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'

import type { Reporting } from '../../entities/reporting'

export const addReporting =
  (reportingContext: ReportingContext, partialReporting?: Partial<Reporting> | undefined) =>
  async (dispatch, getState) => {
    dispatch(attachMissionToReportingSliceActions.resetAttachMissionState())
    const { reportings } = getState().reporting

    const id = createIdForNewReporting(reportings)

    const newReporting = {
      context: reportingContext,
      isFormDirty: false,
      reporting: getReportingInitialValues({ createdAt: new Date().toISOString(), id, ...partialReporting })
    }

    await dispatch(
      setReportingFormVisibility({
        context: reportingContext,
        visibility: VisibilityState.VISIBLE
      })
    )

    await dispatch(reportingActions.setReporting(newReporting))
    await dispatch(reportingActions.setActiveReportingId(id))

    await dispatch(attachMissionToReportingSliceActions.resetAttachMissionState())
  }
