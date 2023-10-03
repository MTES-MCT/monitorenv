import { logSoftError } from '@mtes-mct/monitor-ui'

import { administrationsAPI } from '../../../api/administrationsAPI'
import { isUserError } from '../../../libs/UserError'
import { backOfficeActions } from '../../shared_slices/BackOffice'

import type { AppThunk } from '../../../store'

export const archiveAdministration = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const administrationId = getState().backOffice.confirmationModalActionId

  try {
    const { error } = await dispatch(
      administrationsAPI.endpoints.archiveAdministration.initiate(administrationId) as any
    )
    if (error) {
      throw error
    }
  } catch (err) {
    if (isUserError(err)) {
      dispatch(backOfficeActions.openDialog({ message: err.userMessage }))

      return
    }

    logSoftError({
      message: `An error happened while archiving an administration (ID=${administrationId}").`,
      originalError: err,
      userMessage: "Une erreur est survenue pendant l'archivage de l'administration."
    })
  }
}
