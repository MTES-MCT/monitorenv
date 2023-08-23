import { reportingsAPI } from '../../../api/reportingsAPI'
import { setToast } from '../../shared_slices/Global'

export const archiveMultipleReportings = (ids, resetSelectionFn) => async dispatch => {
  try {
    const response = await dispatch(reportingsAPI.endpoints.archiveReportings.initiate({ ids }))

    if ('error' in response) {
      throw Error("Erreur à l'archivage des signalements")
    } else {
      dispatch(
        setToast({
          containerId: 'sideWindow',
          message: 'Les signalements ont bien été archivés',
          type: 'success'
        })
      )
      resetSelectionFn()
    }
  } catch (error) {
    dispatch(setToast({ containerId: 'sideWindow', message: error }))
  }
}
