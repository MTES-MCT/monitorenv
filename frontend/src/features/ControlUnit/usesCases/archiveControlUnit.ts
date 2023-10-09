import { logSoftError } from '@mtes-mct/monitor-ui'

import { controlUnitsAPI } from '../../../api/controlUnitsAPI'
import { FrontendError } from '../../../libs/FrontendError'

import type { AppThunk } from '../../../store'

export const archiveControlUnit = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { confirmationModal } = getState().backOffice
  if (!confirmationModal) {
    throw new FrontendError('`confirmationModal` is indefined.')
  }

  try {
    const { error } = await dispatch(
      controlUnitsAPI.endpoints.archiveControlUnit.initiate(confirmationModal.entityId) as any
    )
    if (error) {
      throw error
    }
  } catch (err) {
    logSoftError({
      message: `An error happened while archiving a control unit (ID=${confirmationModal.entityId}").`,
      originalError: err,
      userMessage: "Une erreur est survenue pendant l'archivage de l'unité de contrôle."
    })
  }
}
