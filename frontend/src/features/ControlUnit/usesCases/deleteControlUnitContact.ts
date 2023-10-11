import { logSoftError } from '@mtes-mct/monitor-ui'

import { controlUnitContactsAPI } from '../../../api/controlUnitContactsAPI'
import { FrontendError } from '../../../libs/FrontendError'
import { isUserError } from '../../../libs/UserError'
import { mainWindowActions } from '../../MainWindow/slice'

import type { AppThunk } from '../../../store'

export const deleteControlUnitContact = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { confirmationModal } = getState().mainWindow
  if (!confirmationModal) {
    throw new FrontendError('`confirmationModal` is undefined.')
  }

  try {
    const { error } = await dispatch(
      controlUnitContactsAPI.endpoints.deleteControlUnitContact.initiate(confirmationModal.entityId) as any
    )
    if (error) {
      throw error
    }
  } catch (err) {
    if (isUserError(err)) {
      dispatch(mainWindowActions.openDialog({ message: err.userMessage }))

      return
    }

    logSoftError({
      message: `An error happened while deleting a control unit contact (ID=${confirmationModal.entityId}").`,
      originalError: err,
      userMessage: "Une erreur est survenue pendant la suppression de l'unité de contrôle."
    })
  }
}
