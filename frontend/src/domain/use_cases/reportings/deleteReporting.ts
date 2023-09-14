import { reportingsAPI } from '../../../api/reportingsAPI'
import { setReportingFormVisibility, setToast, VisibilityState } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'

export const deleteReporting = (id: number | string | undefined) => async (dispatch, getState) => {
  const { reportings, selectedReportingIdOnMap } = getState().reporting
  try {
    if (!id) {
      throw Error('Erreur à la suppression du signalement')
    }
    const response = await dispatch(reportingsAPI.endpoints.deleteReporting.initiate({ id }))
    if ('error' in response) {
      throw Error('Erreur à la suppression du signalement')
    } else {
      if (id === selectedReportingIdOnMap) {
        dispatch(reportingActions.setSelectedReportingIdOnMap(undefined))
      }

      await dispatch(reportingActions.deleteSelectedReporting(id))
      dispatch(
        setReportingFormVisibility({
          context: reportings[id].context,
          visibility: VisibilityState.NONE
        })
      )
    }
  } catch (error) {
    dispatch(setToast({ message: error }))
  }
}
