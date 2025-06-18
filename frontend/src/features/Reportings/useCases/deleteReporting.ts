import { mainWindowActions } from '@features/MainWindow/slice'
import { reportingActions } from '@features/Reportings/slice'

import { reportingsAPI } from '../../../api/reportingsAPI'
import { ReportingContext, setReportingFormVisibility, VisibilityState } from '../../../domain/shared_slices/Global'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from '../../../domain/use_cases/map/updateMapInteractionListeners'

export const deleteReporting = (id: number | string) => async (dispatch, getState) => {
  const { reportings, selectedReportingIdOnMap } = getState().reporting
  const reportingContext = reportings[id]?.context

  const response = await dispatch(reportingsAPI.endpoints.deleteReporting.initiate({ id }))
  if ('error' in response) {
    throw Error('Erreur à la suppression du signalement')
  } else {
    if (id === selectedReportingIdOnMap) {
      dispatch(reportingActions.setSelectedReportingIdOnMap(undefined))
    }

    await dispatch(reportingActions.deleteSelectedReporting(id))
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
    if (reportingContext === ReportingContext.MAP) {
      dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
    }
    dispatch(
      setReportingFormVisibility({
        context: reportingContext,
        visibility: VisibilityState.NONE
      })
    )
  }
}
