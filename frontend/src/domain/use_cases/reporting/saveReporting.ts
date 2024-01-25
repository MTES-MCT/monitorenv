import omit from 'lodash/omit'

import { reportingsAPI } from '../../../api/reportingsAPI'
import { ApiErrorCode } from '../../../api/types'
import { mainWindowActions } from '../../../features/MainWindow/slice'
import { isNewReporting } from '../../../features/Reportings/utils'
import { setReportingFormVisibility, setToast, ReportingContext, VisibilityState } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'
import { MapInteractionListenerEnum, updateMapInteractionListeners } from '../map/updateMapInteractionListeners'

import type { Reporting } from '../../entities/reporting'

export const saveReporting =
  (values: Reporting | Partial<Reporting>, reportingContext: ReportingContext) => async dispatch => {
    const valuesToSave = omit(values, ['attachedMission'])
    const newOrNextReportingData = isNewReporting(valuesToSave.id) ? { ...valuesToSave, id: undefined } : valuesToSave
    const endpoint = isNewReporting(values.id)
      ? reportingsAPI.endpoints.createReporting
      : reportingsAPI.endpoints.updateReporting

    try {
      const response = await dispatch(endpoint.initiate(newOrNextReportingData))
      if ('data' in response) {
        if (reportingContext === ReportingContext.MAP) {
          dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
        }
        dispatch(
          setReportingFormVisibility({
            context: reportingContext,
            visibility: VisibilityState.NONE
          })
        )
        dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
        dispatch(reportingActions.deleteSelectedReporting(values.id))
      } else {
        if (response.error.data?.type === ApiErrorCode.CHILD_ALREADY_ATTACHED) {
          throw Error('Le signalement est déjà rattaché à une mission')
        }
        throw Error('Erreur à la création ou à la modification du signalement')
      }
    } catch (error) {
      dispatch(setToast({ containerId: reportingContext, message: error }))
    }
  }
