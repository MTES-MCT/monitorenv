import { reportingsAPI } from '../../../api/reportingsAPI'
import { setToast } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'

export const editReportingInLocalStore = reportingId => async dispatch => {
  const reportingToEdit = reportingsAPI.endpoints.getReporting
  try {
    const response = await dispatch(reportingToEdit.initiate(reportingId))
    if ('data' in response) {
      dispatch(multiReportingsActions.setNextSelectedReporting(response.data))
    } else {
      throw Error('Erreur à la récupération du signalement')
    }
  } catch (error) {
    dispatch(setToast({ message: error }))
  }
}
