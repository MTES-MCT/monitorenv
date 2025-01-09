import { mainWindowActions } from '@features/MainWindow/slice'
import { reportingActions } from '@features/Reportings/slice'

import { reportingsAPI } from '../../../api/reportingsAPI'
import {
  ReportingContext,
  setReportingFormVisibility,
  setToast,
  VisibilityState
} from '../../../domain/shared_slices/Global'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from '../../../domain/use_cases/map/updateMapInteractionListeners'

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
      dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
      if (reportings[id].context === ReportingContext.MAP) {
        dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
      }
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
