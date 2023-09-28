import { reportingsAPI } from '../../../api/reportingsAPI'
import { isNewReporting } from '../../../features/Reportings/utils'
import { setReportingFormVisibility, setToast, VisibilityState } from '../../shared_slices/Global'
import { reportingActions } from '../../shared_slices/reporting'
import { addMission } from '../missions/addMission'
import { closeAddZone } from '../missions/closeAddZone'

import type { Reporting } from '../../entities/reporting'

export const createMissionFromReporting = (values: Reporting | Partial<Reporting>) => async (dispatch, getState) => {
  const {
    reportingFormVisibility: { context: reportingContext }
  } = getState().global
  const cleanValues = isNewReporting(values.id) ? { ...values, id: undefined } : values
  const endpoint = isNewReporting(values.id)
    ? reportingsAPI.endpoints.createReporting
    : reportingsAPI.endpoints.updateReporting

  try {
    const response = await dispatch(endpoint.initiate(cleanValues))

    if ('data' in response) {
      await dispatch(
        setReportingFormVisibility({
          context: reportingContext,
          visibility: VisibilityState.NONE
        })
      )
      await dispatch(closeAddZone())
      await dispatch(reportingActions.deleteSelectedReporting(values.id))
      await dispatch(addMission(response.data))
    } else {
      throw Error('Erreur à la création ou à la modification du signalement')
    }
  } catch (error) {
    dispatch(setToast({ containerId: reportingContext, message: error }))
  }
}
