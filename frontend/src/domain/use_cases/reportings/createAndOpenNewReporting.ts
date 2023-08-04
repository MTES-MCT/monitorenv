import { addReporting } from './addReporting'
import { getReportingInitialValues } from '../../../features/Reportings/utils'
import { hideSideButtons, setReportingFormVisibility } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { ReportingFormVisibility, reportingStateActions } from '../../shared_slices/ReportingState'

import type { Reporting } from '../../entities/reporting'

export const createAndOpenNewReporting =
  (initialReporting?: Partial<Reporting> | undefined) => (dispatch, getState) => {
    const { isDirty } = getState().reportingState
    if (isDirty) {
      dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(true))
      dispatch(multiReportingsActions.setNextSelectedReporting(getReportingInitialValues(initialReporting)))
    } else {
      dispatch(addReporting(initialReporting))
    }
    dispatch(hideSideButtons())
    dispatch(setReportingFormVisibility(ReportingFormVisibility.VISIBLE))
    dispatch(reportingStateActions.setSelectedReportingIdOnMap(undefined))
  }
