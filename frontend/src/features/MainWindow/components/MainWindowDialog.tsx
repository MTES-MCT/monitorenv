import { Button, Dialog } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'

import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { FrontendError } from '../../../libs/FrontendError'
import { mainWindowActions } from '../slice'

export function MainWindowDialog() {
  const dispatch = useAppDispatch()
  const { dialog } = useAppSelector(store => store.mainWindow)
  if (!dialog) {
    throw new FrontendError('`dialog` is undefined.')
  }

  const close = useCallback(() => {
    dispatch(mainWindowActions.closeDialog())
  }, [dispatch])

  return (
    <Dialog>
      <Dialog.Body>
        <p>{dialog.message}</p>
      </Dialog.Body>
      <Dialog.Action>
        <Button onClick={close}>Fermer</Button>
      </Dialog.Action>
    </Dialog>
  )
}
