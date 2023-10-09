import { useCallback } from 'react'

import { Dialog } from '../../../components/Dialog'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { FrontendError } from '../../../libs/FrontendError'
import { backOfficeActions } from '../slice'

export function BackOfficeDialog() {
  const dispatch = useAppDispatch()
  const { dialog } = useAppSelector(store => store.backOffice)
  if (!dialog) {
    throw new FrontendError('`dialog` is undefined.')
  }

  const close = useCallback(() => {
    dispatch(backOfficeActions.closeDialog())
  }, [dispatch])

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Dialog {...dialog.dialogProps} onClose={close} />
}
