import { THEME, logSoftError } from '@mtes-mct/monitor-ui'

import { administrationsAPI } from '../../../api/administrationsAPI'
import { FrontendError } from '../../../libs/FrontendError'
import { isUserError } from '../../../libs/UserError'
import { backOfficeActions } from '../../BackOffice/slice'

import type { AppThunk } from '../../../store'

export const deleteAdministration = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { confirmationModal } = getState().backOffice
  if (!confirmationModal) {
    throw new FrontendError('`confirmationModal` is undefined.')
  }

  try {
    const { error } = await dispatch(
      administrationsAPI.endpoints.deleteAdministration.initiate(confirmationModal.entityId) as any
    )
    if (error) {
      throw error
    }
  } catch (err) {
    if (isUserError(err)) {
      dispatch(
        backOfficeActions.openDialog({
          dialogProps: {
            color: THEME.color.maximumRed,
            message: err.userMessage,
            title: `Suppression impossible`,
            titleBackgroundColor: THEME.color.maximumRed
          }
        })
      )

      return
    }

    logSoftError({
      message: `An error happened while deleting an administration (ID=${confirmationModal.entityId}").`,
      originalError: err,
      userMessage: "Une erreur est survenue pendant la suppression de l'administration."
    })
  }
}
