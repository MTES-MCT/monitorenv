import { reportingActions } from '@features/Reportings/slice'
import { Level } from '@mtes-mct/monitor-ui'

import { reportingsAPI } from '../../../api/reportingsAPI'
import { ReportingContext } from '../../../domain/shared_slices/Global'
import { displayReportingBanner } from '../utils'

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
        displayReportingBanner({
          context: reportingContext,
          dispatch,
          level: Level.SUCCESS,
          message: 'Le signalement a bien été réouvert'
        })
      } else {
        throw Error('Erreur à la réouvertue du signalement')
      }
    } catch (error) {
      displayReportingBanner({
        context: reportingContext,
        dispatch,
        level: Level.ERROR,
        message: error instanceof Error ? error.message : String(error)
      })
    }
  }
