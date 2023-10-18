import { FrontendError } from '../../../libs/FrontendError'
import { deleteBase } from '../../Base/useCases/deleteBase'
import { backOfficeActions } from '../slice'
import { BackOfficeConfirmationModalActionType } from '../types'

import type { AppThunk } from '../../../store'

export const handleModalConfirmation = (): AppThunk<void> => async (dispatch, getState) => {
  const { confirmationModal } = getState().backOffice
  if (!confirmationModal) {
    throw new FrontendError('`confirmationModal` is undefined.')
  }

  switch (confirmationModal.actionType) {
    case BackOfficeConfirmationModalActionType.DELETE_BASE:
      await dispatch(deleteBase())
      break

    default:
      break
  }

  dispatch(backOfficeActions.closeConfirmationModal())
}
