import { THEME, logSoftError } from '@mtes-mct/monitor-ui'

import { controlUnitsAPI } from '../../../api/controlUnitsAPI'
import { FrontendError } from '../../../libs/FrontendError'
import { isUserError } from '../../../libs/UserError'
import { backOfficeActions } from '../../BackOffice/slice'

import type { AppThunk } from '../../../store'

export const deleteControlUnit = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { confirmationModal } = getState().backOffice
  if (!confirmationModal) {
    throw new FrontendError('`confirmationModal` is indefined.')
  }

  try {
    const { error } = await dispatch(
      controlUnitsAPI.endpoints.deleteControlUnit.initiate(confirmationModal.entityId) as any
    )
    if (error) {
      throw error
    }
  } catch (err) {
    if (isUserError(err)) {
      dispatch(
        backOfficeActions.openDialog({
          dialogProps: {
            color: THEME.color.maximumRed,
            message: err.userMessage,
            title: `Suppression impossible`,
            titleBackgroundColor: THEME.color.maximumRed
          }
        })
      )

      return
    }

    logSoftError({
      message: `An error happened while deleting a control unit (ID=${confirmationModal.entityId}").`,
      originalError: err,
      userMessage: "Une erreur est survenue pendant la suppression de l'unité de contrôle."
    })
  }
}
