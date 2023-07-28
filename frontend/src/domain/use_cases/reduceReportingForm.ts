import { setReportingFormVisibility } from '../shared_slices/Global'
import { ReportingFormVisibility } from '../shared_slices/ReportingState'

export const reduceReportingForm = () => (dispatch, getState) => {
  const { reportingFormVisibility } = getState().global
  if (reportingFormVisibility !== ReportingFormVisibility.NONE) {
    dispatch(setReportingFormVisibility(ReportingFormVisibility.REDUCED))
  }
}
