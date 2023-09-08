import { getReportingInitialValues, createIdForNewReporting } from '../../../features/Reportings/utils'
import { setReportingFormVisibility } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { ReportingContext, VisibilityState } from '../../shared_slices/ReportingState'

import type { AppGetState } from '../../../store'
import type { Reporting } from '../../entities/reporting'

export const addReporting =
  (reportingContext: ReportingContext, partialReporting?: Partial<Reporting> | undefined) =>
  async (dispatch, getState: AppGetState) => {
    const {
      multiReportings: { selectedReportings }
    } = getState()

    const id = createIdForNewReporting(selectedReportings)

    const newReport = {
      context: reportingContext,
      isFormDirty: false,
      reporting: getReportingInitialValues({ createdAt: new Date().toISOString(), id, ...partialReporting })
    }

    await dispatch(multiReportingsActions.setReporting(newReport))

    await dispatch(
      setReportingFormVisibility({
        context: reportingContext,
        visibility: VisibilityState.VISIBLE
      })
    )
  }
