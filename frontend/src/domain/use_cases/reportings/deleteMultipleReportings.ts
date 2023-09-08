import { reportingsAPI } from '../../../api/reportingsAPI'
import { setReportingFormVisibility, setToast } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { VisibilityState } from '../../shared_slices/ReportingState'

import type { AppGetState } from '../../../store'

export const deleteMultipleReportings =
  (ids: number[], resetSelectionFn: () => void) => async (dispatch, getState: AppGetState) => {
    const {
      multiReportings: { selectedReportingId, selectedReportingIdOnMap }
    } = getState()

    try {
      const response = await dispatch(reportingsAPI.endpoints.deleteReportings.initiate({ ids }))
      if ('error' in response) {
        throw Error('Erreur à la suppression des signalements')
      } else {
        if (
          selectedReportingIdOnMap &&
          typeof selectedReportingIdOnMap === 'number' &&
          ids.includes(selectedReportingIdOnMap)
        ) {
          dispatch(multiReportingsActions.setSelectedReportingIdOnMap(undefined))
        }

        if (selectedReportingId && typeof selectedReportingId === 'number' && ids.includes(selectedReportingId)) {
          dispatch(multiReportingsActions.setSelectedReportingId(undefined))
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
