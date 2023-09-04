import { reportingsAPI } from '../../../api/reportingsAPI'
import { isNewReporting } from '../../../features/Reportings/utils'
import { setReportingFormVisibility, setToast } from '../../shared_slices/Global'
import { VisibilityState } from '../../shared_slices/ReportingState'
import { closeAddZone } from '../missions/closeAddZone'

export const saveReporting = (values, reportingContext) => async dispatch => {
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
    } else {
      throw Error('Erreur à la création ou à la modification du signalement')
    }
  } catch (error) {
    dispatch(setToast({ containerId: reportingContext, message: error }))
  }
}
