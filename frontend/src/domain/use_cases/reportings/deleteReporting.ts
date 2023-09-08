import { reportingsAPI } from '../../../api/reportingsAPI'
import { setReportingFormVisibility, setToast } from '../../shared_slices/Global'
import { multiReportingsActions } from '../../shared_slices/MultiReportings'
import { ReportingContext, VisibilityState } from '../../shared_slices/ReportingState'

import type { AppGetState } from '../../../store'

export const deleteReporting = (id: number | string | undefined) => async (dispatch, getState: AppGetState) => {
  const {
    multiReportings: { selectedReportingIdOnMap }
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

      dispatch(multiReportingsActions.setSelectedReportingId(undefined))
      dispatch(
        setReportingFormVisibility({
          // fixme: reportingContext is not defined
          context: ReportingContext.MAP,
          visibility: VisibilityState.NONE
        })
      )
    }
  } catch (error) {
    dispatch(setToast({ message: error }))
  }
}
