import { reportingsAPI } from '../../../api/reportingsAPI'
import { setToast } from '../../shared_slices/Global'

export const saveReporting = values => async dispatch => {
  const endpoint = reportingsAPI.endpoints.createReporting
  try {
    const response = await dispatch(endpoint.initiate(values))
    if ('data' in response) {
      // eslint-disable-next-line no-console
      console.log('response', response)
    } else {
      throw Error('Erreur à la création ou à la modification de la mission')
    }
  } catch (error) {
    dispatch(setToast({ message: error }))
  }
}
