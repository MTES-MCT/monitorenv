import { reportingsAPI } from '../../../api/reportingsAPI'
import { setToast } from '../../shared_slices/Global'

import type { Reporting } from '../../entities/reporting'
import type { ReportingContext } from '../../shared_slices/ReportingState'

export const reopenReporting = (values: Reporting, reportingContext: ReportingContext) => async dispatch => {
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
