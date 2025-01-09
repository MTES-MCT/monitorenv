import { reportingActions } from '@features/Reportings/slice'

import { reportingsAPI } from '../../../api/reportingsAPI'
import { setToast, ReportingContext } from '../../../domain/shared_slices/Global'

import type { Reporting } from '../../../domain/entities/reporting'

export const reopenReporting =
  (values: Reporting, reportingContext: ReportingContext) => async (dispatch, getState) => {
    const { reportings } = getState().reporting
    try {
      const response = await dispatch(reportingsAPI.endpoints.updateReporting.initiate(values))
      if ('data' in response) {
        const updatedReporting = {
          ...reportings[response.data.id],
          context: reportingContext,
          reporting: response.data
        }

        await dispatch(reportingActions.setReporting(updatedReporting))
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
      dispatch(setToast({ containerId: reportingContext, message: error }))
    }
  }
