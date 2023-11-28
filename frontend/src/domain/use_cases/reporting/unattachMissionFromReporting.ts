import omit from 'lodash/omit'

import { reportingsAPI } from '../../../api/reportingsAPI'
import { attachMissionToReportingSliceActions } from '../../../features/Reportings/slice'
import { setToast, ReportingContext } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'
import { MapInteractionListenerEnum, updateMapInteractionListeners } from '../map/updateMapInteractionListeners'

import type { Reporting } from '../../entities/reporting'

export const unattachMissionFromReporting =
  (values: Reporting | Partial<Reporting>, reportingContext: ReportingContext) => async dispatch => {
    const newOrNextReportingData = omit(values, ['attachedMission'])
    const endpoint = reportingsAPI.endpoints.updateReporting

    try {
      const response = await dispatch(endpoint.initiate(newOrNextReportingData))
      if ('data' in response) {
        const updatedReporting = {
          context: reportingContext,
          isFormDirty: false,
          reporting: response.data
        }
        await dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
        await dispatch(reportingActions.setReporting(updatedReporting))
        await dispatch(attachMissionToReportingSliceActions.setAttachedMission(response.data.attachedMission))
      } else {
        throw Error('Erreur au détachement de la mission')
      }
    } catch (error) {
      dispatch(setToast({ containerId: reportingContext, message: error }))
    }
  }
