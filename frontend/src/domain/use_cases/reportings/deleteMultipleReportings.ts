import { reportingsAPI } from '../../../api/reportingsAPI'
import { setReportingFormVisibility, setToast } from '../../shared_slices/Global'
import { ReportingFormVisibility, reportingStateActions } from '../../shared_slices/ReportingState'

export const deleteMultipleReportings = (ids, resetSelectionFn) => async (dispatch, getState) => {
  const {
    reportingState: { selectedReportingId, selectedReportingIdOnMap }
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
        dispatch(setReportingFormVisibility(ReportingFormVisibility.NONE))
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
