import { reportingsAPI } from '../../../api/reportingsAPI'
import { setReportingFormVisibility, setToast } from '../../shared_slices/Global'
import { VisibilityState, reportingStateActions } from '../../shared_slices/ReportingState'

export const deleteMultipleReportings = (ids, resetSelectionFn) => async (dispatch, getState) => {
  const {
    reportingState: { context, selectedReportingId, selectedReportingIdOnMap }
  } = getState()

  try {
    const response = await dispatch(reportingsAPI.endpoints.deleteReportings.initiate({ ids }))
    if ('error' in response) {
      throw Error('Erreur à la suppression des signalements')
    } else {
      if (ids.includes(selectedReportingIdOnMap)) {
        dispatch(reportingStateActions.setSelectedReportingIdOnMap(undefined))
      }

      if (ids.includes(selectedReportingId)) {
        dispatch(reportingStateActions.setSelectedReportingId(undefined))
        dispatch(
          setReportingFormVisibility({
            context,
            visibility: VisibilityState.NONE
          })
        )
      }

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
