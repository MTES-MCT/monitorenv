import omit from 'lodash/omit'

import { reportingsAPI } from '../../../api/reportingsAPI'
import { isNewReporting } from '../../../features/Reportings/utils'
import { setReportingFormVisibility, setToast, VisibilityState } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'
import { MapInteractionListenerEnum, updateMapInteractionListeners } from '../map/updateMapInteractionListeners'
import { addMission } from '../missions/addMission'

import type { Reporting } from '../../entities/reporting'

export const createMissionFromReporting = (values: Reporting | Partial<Reporting>) => async (dispatch, getState) => {
  const {
    reportingFormVisibility: { context: reportingContext }
  } = getState().global

  const valuesToSave = omit(values, ['attachedMission'])
  const newOrNextReportingData = isNewReporting(valuesToSave.id) ? { ...valuesToSave, id: undefined } : valuesToSave
  const endpoint = reportingsAPI.endpoints.createReporting

  try {
    const response = await dispatch(endpoint.initiate(newOrNextReportingData))

    if ('data' in response) {
      await dispatch(
        setReportingFormVisibility({
          context: reportingContext,
          visibility: VisibilityState.NONE
        })
      )
      await dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
      await dispatch(reportingActions.deleteSelectedReporting(values.id))
      await dispatch(addMission(response.data))
    } else {
      throw Error('Erreur à la création ou à la modification du signalement')
    }
  } catch (error) {
    dispatch(setToast({ containerId: reportingContext, message: error }))
  }
}
