import { FrontendError } from '../../../libs/FrontendError'
import { deleteControlUnitContact } from '../../ControlUnit/usesCases/deleteControlUnitContact'
import { deleteControlUnitResource } from '../../ControlUnit/usesCases/deleteControlUnitResource'
import { mainWindowActions } from '../slice'
import { MainWindowConfirmationModalActionType } from '../types'

import type { HomeAppThunk } from '../../../store'

export const handleModalConfirmation = (): HomeAppThunk<void> => async (dispatch, getState) => {
  const { confirmationModal } = getState().mainWindow
  if (!confirmationModal) {
    throw new FrontendError('`confirmationModal` is undefined.')
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
