import { reportingsAPI } from '../../../api/reportingsAPI'
import { setToast } from '../../shared_slices/Global'

export const reopenReporting = values => async dispatch => {
  try {
    const response = await dispatch(reportingsAPI.endpoints.updateReporting.initiate(values))
    if ('data' in response) {
      dispatch(
        setToast({
          message: 'Le signalement a bien été réouvert',
          type: 'success'
        })
      )
    } else {
      throw Error('Erreur à la réouvertue du signalement')
    }
  } catch (error) {
    dispatch(setToast({ message: error }))
  }
}
