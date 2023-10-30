import { logSoftError } from '@mtes-mct/monitor-ui'

import { controlUnitResourcesAPI } from '../../../api/controlUnitResourcesAPI'
import { FrontendError } from '../../../libs/FrontendError'
import { isUserError } from '../../../libs/UserError'
import { mainWindowActions } from '../../MainWindow/slice'

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
    if (isUserError(err)) {
      dispatch(mainWindowActions.openDialog({ message: err.userMessage }))

      return
    }

    logSoftError({
      message: `An error happened while deleting a control unit resource (ID=${confirmationModal.entityId}").`,
      originalError: err,
      userMessage: 'Une erreur est survenue pendant la suppression du moyen.'
    })
  }
}
