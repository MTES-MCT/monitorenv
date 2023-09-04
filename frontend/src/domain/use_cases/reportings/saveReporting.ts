import { reportingsAPI } from '../../../api/reportingsAPI'
import { setReportingFormVisibility, setToast } from '../../shared_slices/Global'
import { VisibilityState } from '../../shared_slices/ReportingState'
import { closeAddZone } from '../missions/closeAddZone'

export const saveReporting = (reportingContext, values) => async dispatch => {
  const endpoint = values.id ? reportingsAPI.endpoints.updateReporting : reportingsAPI.endpoints.createReporting
  try {
    const response = await dispatch(endpoint.initiate(values))
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
    dispatch(setToast({ message: error }))
  }
}
