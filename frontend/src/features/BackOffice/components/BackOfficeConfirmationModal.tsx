import { useCallback } from 'react'

import { ConfirmationModal } from '../../../components/ConfirmationModal'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { FrontendError } from '../../../libs/FrontendError'
import { backOfficeActions } from '../slice'
import { handleModalConfirmation } from '../useCases/handleModalConfirmation'

export function BackOfficeConfirmationModal() {
  const dispatch = useAppDispatch()
  const { confirmationModal } = useAppSelector(store => store.backOffice)
  if (!confirmationModal) {
    throw new FrontendError('`confirmationModal` is undefined.')
  }

  const close = useCallback(() => {
    dispatch(backOfficeActions.closeConfirmationModal())
  }, [dispatch])

  const confirm = useCallback(() => {
    dispatch(handleModalConfirmation())
  }, [dispatch])

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ConfirmationModal {...confirmationModal.modalProps} onCancel={close} onConfirm={confirm} />
}
