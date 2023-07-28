import { reportingsAPI } from '../../../api/reportingsAPI'
import { setReportingFormVisibility, setToast } from '../../shared_slices/Global'
import { ReportingFormVisibility } from '../../shared_slices/ReportingState'

export const saveReporting = values => async dispatch => {
  const endpoint = values.id ? reportingsAPI.endpoints.updateReporting : reportingsAPI.endpoints.createReporting
  try {
    const response = await dispatch(endpoint.initiate(values))
    if ('data' in response) {
      // eslint-disable-next-line no-console
      console.log('response', response)
      dispatch(setReportingFormVisibility(ReportingFormVisibility.NOT_VISIBLE))
    } else {
      throw Error('Erreur à la création ou à la modification de la mission')
    }
  } catch (error) {
    dispatch(setToast({ message: error }))
  }
}
