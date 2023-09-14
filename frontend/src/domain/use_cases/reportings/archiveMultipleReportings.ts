import { reportingsAPI } from '../../../api/reportingsAPI'
import { setToast } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'

export const archiveMultipleReportings =
  (ids: number[], resetSelectionFn: () => void) => async (dispatch, getState) => {
    const reportings = getState().multiReportings.selectedReportings
    try {
      const response = await dispatch(reportingsAPI.endpoints.archiveReportings.initiate({ ids }))

      if ('error' in response) {
        throw Error("Erreur à l'archivage des signalements")
      } else {
        ids.map(id => {
          if (reportings[id]) {
            dispatch(
              multiReportingsActions.setReporting({
                ...reportings[id],
                reporting: {
                  ...reportings[id].reporting,
                  isArchived: true
                }
              })
            )
          }

          return undefined
        })
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
