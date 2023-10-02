import { Accent, Button, Dialog } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'

import { backOfficeActions } from '../../../domain/shared_slices/BackOffice'
import { handleModalConfirmation } from '../../../domain/use_cases/backOffice/handleModalConfirmation'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'

export function ConfirmationModal() {
  const dispatch = useAppDispatch()
  const backOffice = useAppSelector(store => store.backOffice)

  const cancel = useCallback(() => {
    dispatch(backOfficeActions.closeConfirmationModal())
  }, [dispatch])

  const confirm = useCallback(() => {
    dispatch(handleModalConfirmation())
  }, [dispatch])

  return (
    <Dialog>
      <Dialog.Body>
        <p>{backOffice.confirmationModalMessage}</p>
      </Dialog.Body>
      <Dialog.Action>
        <Button accent={Accent.SECONDARY} onClick={cancel}>
          Annuler
        </Button>
        <Button onClick={confirm} style={{ marginLeft: 8 }}>
          Confirmer
        </Button>
      </Dialog.Action>
    </Dialog>
  )
}
