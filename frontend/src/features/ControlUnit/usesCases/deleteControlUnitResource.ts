import { logSoftError } from '@mtes-mct/monitor-ui'

import { controlUnitResourcesAPI } from '../../../api/controlUnitResourcesAPI'
import { FrontendError } from '../../../libs/FrontendError'

import type { HomeAppThunk } from '../../../store'

export const deleteControlUnitResource = (): HomeAppThunk<Promise<void>> => async (dispatch, getState) => {
  const { confirmationModal } = getState().mainWindow
  if (!confirmationModal) {
    throw new FrontendError('`confirmationModal` is undefined.')
  }

  try {
    const { error } = await dispatch(
      controlUnitResourcesAPI.endpoints.deleteControlUnitResource.initiate(confirmationModal.entityId) as any
    )
    if (error) {
      throw error
    }
  } catch (err) {
    logSoftError({
      message: `An error happened while deleting a control unit contact (ID=${confirmationModal.entityId}").`,
      originalError: err,
      userMessage: "Une erreur est survenue pendant la suppression de l'unité de contrôle."
    })
  }
}
