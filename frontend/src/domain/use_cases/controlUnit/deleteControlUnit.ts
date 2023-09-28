import { logSoftError } from '@mtes-mct/monitor-ui'

import { controlUnitsAPI } from '../../../api/controlUnitsAPI'

import type { AppThunk } from '../../../store'

export const deleteControlUnit = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const controlUnitId = getState().backOffice.confirmationModalActionId

  try {
    const { error } = await dispatch(controlUnitsAPI.endpoints.deleteControlUnit.initiate(controlUnitId) as any)
    if (error) {
      throw error
    }
  } catch (err) {
    logSoftError({
      message: `An error happened while deleting a control unit (ID=${controlUnitId}").`,
      originalError: err,
      userMessage: "Une erreur est survenue pendant la suppression de l'unité de contrôle."
    })
  }
}
