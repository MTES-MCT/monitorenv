import { saveReportingInMultiReportingsState } from './saveReportingInMultiReportingsState'
import { getReportingInitialValues, createIdForNewReporting } from '../../../features/Reportings/utils'
import { setReportingFormVisibility } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { ReportingContext, VisibilityState } from '../../shared_slices/ReportingState'

import type { Reporting } from '../../entities/reporting'

export const addReporting =
  (reportingContext: ReportingContext, partialReporting?: Partial<Reporting> | undefined) =>
  async (dispatch, getState) => {
    const {
      multiReportings: { selectedReportings },
      reportingState: { reportingState }
    } = getState()
    let reportings = [...selectedReportings]

    // first we want to save the active reporting in multiReportings state
    if (reportingState) {
      reportings = await dispatch(saveReportingInMultiReportingsState())
    }
    const id = createIdForNewReporting(reportings)

    const updatedReportings = [
      ...reportings,
      {
        context: reportingContext,
        isFormDirty: false,
        reporting: getReportingInitialValues({ createdAt: new Date().toISOString(), id, ...partialReporting })
      }
    ]

    await dispatch(
      multiReportingsActions.setSelectedReportings({ activeReportingId: id, selectedReportings: updatedReportings })
    )

    await dispatch(
      setReportingFormVisibility({
        context: reportingContext,
        visibility: VisibilityState.VISIBLE
      })
    )
  }
