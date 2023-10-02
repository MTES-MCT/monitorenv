import { logSoftError } from '@mtes-mct/monitor-ui'

import { controlUnitsAPI } from '../../../api/controlUnitsAPI'
import { isUserError } from '../../../libs/UserError'
import { backOfficeActions } from '../../shared_slices/BackOffice'

import type { AppThunk } from '../../../store'

export const deleteControlUnit = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const controlUnitId = getState().backOffice.confirmationModalActionId

  try {
    const { error } = await dispatch(controlUnitsAPI.endpoints.deleteControlUnit.initiate(controlUnitId) as any)
    if (error) {
      throw error
    }
  } catch (err) {
    if (isUserError(err)) {
      dispatch(
        backOfficeActions.openDialog({
          message: err.userMessage
        })
      )

      return
    }

    logSoftError({
      message: `An error happened while deleting a control unit (ID=${controlUnitId}").`,
      originalError: err,
      userMessage: "Une erreur est survenue pendant la suppression de l'unité de contrôle."
    })
  }
}
