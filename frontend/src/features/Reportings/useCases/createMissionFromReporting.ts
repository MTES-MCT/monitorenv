import { mainWindowActions } from '@features/MainWindow/slice'
import { reportingActions } from '@features/Reportings/slice'
import omit from 'lodash/omit'

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
import { addMission } from '../../Mission/useCases/addMission'
import { isNewReporting } from '../utils'

import type { Reporting } from '../../../domain/entities/reporting'

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
      if (reportingContext === ReportingContext.MAP) {
        dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(false))
      }
      dispatch(
        setReportingFormVisibility({
          context: reportingContext,
          visibility: VisibilityState.NONE
        })
      )
      await dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
      await dispatch(reportingActions.deleteSelectedReporting(values.id))
      await dispatch(addMission({ attachedReporting: response.data }))
    } else {
      throw Error('Erreur à la création ou à la modification du signalement')
    }
  } catch (error) {
    dispatch(setToast({ containerId: reportingContext, message: error }))
  }
}
