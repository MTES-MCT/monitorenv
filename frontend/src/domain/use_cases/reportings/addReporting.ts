import { getReportingInitialValues, createIdForNewReporting } from '../../../features/Reportings/utils'
import { setReportingFormVisibility, ReportingContext, VisibilityState } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'

import type { Reporting } from '../../entities/reporting'

export const addReporting =
  (reportingContext: ReportingContext, partialReporting?: Partial<Reporting> | undefined) =>
  async (dispatch, getState) => {
    const {
      multiReportings: { selectedReportings }
    } = getState()
    const reportings = { ...selectedReportings }

    const id = createIdForNewReporting(reportings)

    const newReporting = {
      context: reportingContext,
      isFormDirty: false,
      reporting: getReportingInitialValues({ createdAt: new Date().toISOString(), id, ...partialReporting })
    }

    await dispatch(multiReportingsActions.setReporting(newReporting))
    // await dispatch(multiReportingsActions.setActiveReportingId(id))

    await dispatch(
      setReportingFormVisibility({
        context: reportingContext,
        visibility: VisibilityState.VISIBLE
      })
    )
  }
