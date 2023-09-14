import { reportingsAPI } from '../../../api/reportingsAPI'
import { setReportingFormVisibility, setToast, VisibilityState } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'

export const deleteMultipleReportings = (ids: number[], resetSelectionFn: () => void) => async (dispatch, getState) => {
  const { activeReportingId, context, selectedReportingIdOnMap } = getState().reporting

  try {
    const response = await dispatch(reportingsAPI.endpoints.deleteReportings.initiate({ ids }))
    if ('error' in response) {
      throw Error('Erreur à la suppression des signalements')
    } else {
      if (ids.includes(selectedReportingIdOnMap)) {
        dispatch(reportingActions.setSelectedReportingIdOnMap(undefined))
      }

      if (ids.includes(activeReportingId)) {
        dispatch(reportingActions.setActiveReportingId(undefined))
        dispatch(
          setReportingFormVisibility({
            context,
            visibility: VisibilityState.NONE
          })
        )
      }

      ids.map(id => dispatch(reportingActions.deleteSelectedReporting(id)))

      dispatch(
        setToast({
          containerId: 'sideWindow',
          message: 'Les signalements ont bien été supprimés',
          type: 'success'
        })
      )
      resetSelectionFn()
    }
  } catch (error) {
    dispatch(setToast({ containerId: 'sideWindow', message: error }))
  }
}
