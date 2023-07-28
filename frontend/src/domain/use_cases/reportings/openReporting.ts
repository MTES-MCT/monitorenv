import { editReportingInLocalStore } from './editReportingInLocalStore'
import { hideSideButtons, setReportingFormVisibility } from '../../shared_slices/Global'
import { ReportingFormVisibility, reportingStateActions } from '../../shared_slices/ReportingState'

export const openReporting = reportingId => async (dispatch, getState) => {
  const { isDirty } = getState().reportingState
  if (isDirty) {
    dispatch(reportingStateActions.setIsConfirmCancelDialogVisible(true))
    dispatch(editReportingInLocalStore(reportingId, true))
  } else {
    dispatch(editReportingInLocalStore(reportingId, false))
    dispatch(reportingStateActions.setSelectedReportingId(reportingId))
  }
  dispatch(hideSideButtons())
  dispatch(setReportingFormVisibility(ReportingFormVisibility.VISIBLE))
}
