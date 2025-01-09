import { attachMissionToReportingSliceActions } from '@features/Reportings/components/ReportingForm/AttachMission/slice'
import { reportingActions } from '@features/Reportings/slice'
import { ReportingContext, setReportingFormVisibility, VisibilityState } from 'domain/shared_slices/Global'

import { mainWindowActions } from '../../MainWindow/slice'
import { getReportingInitialValues, createIdForNewReporting } from '../utils'

import type { Reporting } from '../../../domain/entities/reporting'
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
