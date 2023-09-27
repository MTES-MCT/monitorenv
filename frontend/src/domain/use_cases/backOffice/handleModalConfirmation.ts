import { BackOfficeConfirmationModalActionType } from './types'
import { closeConfirmationModal } from '../../shared_slices/BackOffice'
import { archiveControlUnit } from '../controlUnit/archiveControlUnit'
import { deleteControlUnit } from '../controlUnit/deleteControlUnit'

import type { AppThunk } from '../../../store'

export const handleModalConfirmation = (): AppThunk<void> => async (dispatch, getState) => {
  const { confirmationModalActionType } = getState().backOffice

  switch (confirmationModalActionType) {
    case BackOfficeConfirmationModalActionType.ARCHIVE_CONTROL_UNIT:
      await dispatch(archiveControlUnit())
      break

    case BackOfficeConfirmationModalActionType.DELETE_CONTROL_UNIT:
      await dispatch(deleteControlUnit())
      break

    default:
      break
  }

  dispatch(closeConfirmationModal())
}
