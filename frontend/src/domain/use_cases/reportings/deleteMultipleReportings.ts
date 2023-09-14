import { reportingsAPI } from '../../../api/reportingsAPI'
import { setReportingFormVisibility, setToast, VisibilityState } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'

export const deleteMultipleReportings = (ids: number[], resetSelectionFn: () => void) => async (dispatch, getState) => {
  const {
    multiReportings: { activeReportingId, context, selectedReportingIdOnMap }
  } = getState()

  try {
    const response = await dispatch(reportingsAPI.endpoints.deleteReportings.initiate({ ids }))
    if ('error' in response) {
      throw Error('Erreur à la suppression des signalements')
    } else {
      if (ids.includes(selectedReportingIdOnMap)) {
        dispatch(multiReportingsActions.setSelectedReportingIdOnMap(undefined))
      }

      if (ids.includes(activeReportingId)) {
        dispatch(multiReportingsActions.setActiveReportingId(undefined))
        dispatch(
          setReportingFormVisibility({
            context,
            visibility: VisibilityState.NONE
          })
        )
      }

      ids.map(id => dispatch(multiReportingsActions.deleteSelectedReporting(id)))

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
