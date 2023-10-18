import { FrontendError } from '../../../libs/FrontendError'
import { archiveAdministration } from '../../Administration/useCases/archiveAdministration'
import { deleteAdministration } from '../../Administration/useCases/deleteAdministration'
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
    case BackOfficeConfirmationModalActionType.ARCHIVE_ADMINISTRATION:
      await dispatch(archiveAdministration())
      break

    case BackOfficeConfirmationModalActionType.DELETE_ADMINISTRATION:
      await dispatch(deleteAdministration())
      break

    case BackOfficeConfirmationModalActionType.DELETE_BASE:
      await dispatch(deleteBase())
      break

    default:
      break
  }

  dispatch(backOfficeActions.closeConfirmationModal())
}
