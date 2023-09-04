import { reportingsAPI } from '../../../api/reportingsAPI'
import { setReportingFormVisibility, setToast } from '../../shared_slices/Global'
import { VisibilityState, reportingStateActions } from '../../shared_slices/ReportingState'

export const deleteReporting = (id: number | string | undefined) => async (dispatch, getState) => {
  const {
    reportingState: { context, selectedReportingIdOnMap }
  } = getState()
  try {
    if (!id) {
      throw Error('Erreur à la suppression du signalement')
    }
    const response = await dispatch(reportingsAPI.endpoints.deleteReporting.initiate({ id }))
    if ('error' in response) {
      throw Error('Erreur à la suppression du signalement')
    } else {
      if (id === selectedReportingIdOnMap) {
        dispatch(reportingStateActions.setSelectedReportingIdOnMap(undefined))
      }

      dispatch(reportingStateActions.setSelectedReportingId(undefined))
      dispatch(
        setReportingFormVisibility({
          context,
          visibility: VisibilityState.NONE
        })
      )
    }
  } catch (error) {
    dispatch(setToast({ message: error }))
  }
}
