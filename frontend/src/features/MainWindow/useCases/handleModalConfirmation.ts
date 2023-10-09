import { FrontendError } from '../../../libs/FrontendError'
import { deleteControlUnitContact } from '../../ControlUnit/usesCases/deleteControlUnitContact'
import { deleteControlUnitResource } from '../../ControlUnit/usesCases/deleteControlUnitResource'
import { mainWindowActions } from '../slice'
import { MainWindowConfirmationModalActionType } from '../types'

import type { AppThunk } from '../../../store'

export const handleModalConfirmation = (): AppThunk<void> => async (dispatch, getState) => {
  const { confirmationModal } = getState().mainWindow
  if (!confirmationModal) {
    throw new FrontendError('`confirmationModal` is indefined.')
  }

  switch (confirmationModal?.actionType) {
    case MainWindowConfirmationModalActionType.DELETE_CONTROL_UNIT_CONTACT:
      await dispatch(deleteControlUnitContact())
      break

    case MainWindowConfirmationModalActionType.DELETE_CONTROL_UNIT_RESOURCE:
      await dispatch(deleteControlUnitResource())
      break

    default:
      break
  }

  dispatch(mainWindowActions.closeConfirmationModal())
}
