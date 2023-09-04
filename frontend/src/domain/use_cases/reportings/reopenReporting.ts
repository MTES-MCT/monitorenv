import { reportingsAPI } from '../../../api/reportingsAPI'
import { setToast } from '../../shared_slices/Global'

export const reopenReporting = (values, reportingContext) => async dispatch => {
  try {
    const response = await dispatch(reportingsAPI.endpoints.updateReporting.initiate(values))
    if ('data' in response) {
      dispatch(
        setToast({
          containerId: reportingContext,
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
