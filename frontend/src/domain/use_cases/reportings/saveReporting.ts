import { reportingsAPI } from '../../../api/reportingsAPI'
import { isNewReporting } from '../../../features/Reportings/utils'
import { setReportingFormVisibility, setToast, ReportingContext, VisibilityState } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { closeAddZone } from '../missions/closeAddZone'

import type { Reporting } from '../../entities/reporting'

export const saveReporting =
  (values: Reporting | Partial<Reporting>, reportingContext: ReportingContext) => async dispatch => {
    const cleanValues = isNewReporting(values.id) ? { ...values, id: undefined } : values
    const endpoint = isNewReporting(values.id)
      ? reportingsAPI.endpoints.createReporting
      : reportingsAPI.endpoints.updateReporting

    try {
      const response = await dispatch(endpoint.initiate(cleanValues))
      if ('data' in response) {
        dispatch(
          setReportingFormVisibility({
            context: reportingContext,
            visibility: VisibilityState.NONE
          })
        )
        dispatch(closeAddZone())
        dispatch(multiReportingsActions.deleteSelectedReporting(values.id))
      } else {
        throw Error('Erreur à la création ou à la modification du signalement')
      }
    } catch (error) {
      dispatch(setToast({ containerId: reportingContext, message: error }))
    }
  }
