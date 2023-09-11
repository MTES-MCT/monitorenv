import { reportingsAPI } from '../../../api/reportingsAPI'
import { setReportingFormVisibility, setToast, VisibilityState } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'

export const deleteReporting = (id: number | string | undefined) => async (dispatch, getState) => {
  const {
    multiReportings: { selectedReportingIdOnMap, selectedReportings }
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
        dispatch(multiReportingsActions.setSelectedReportingIdOnMap(undefined))
      }

      await dispatch(multiReportingsActions.deleteSelectedReporting(id))
      dispatch(
        setReportingFormVisibility({
          context: selectedReportings[id].context,
          visibility: VisibilityState.NONE
        })
      )
    }
  } catch (error) {
    dispatch(setToast({ message: error }))
  }
}
