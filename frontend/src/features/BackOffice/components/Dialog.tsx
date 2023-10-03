import { Button, Dialog as MonitorUiDialog } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'

import { backOfficeActions } from '../../../domain/shared_slices/BackOffice'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'

export function Dialog() {
  const dispatch = useAppDispatch()
  const backOffice = useAppSelector(store => store.backOffice)

  const close = useCallback(() => {
    dispatch(backOfficeActions.closeDialog())
  }, [dispatch])

  return (
    <MonitorUiDialog>
      <MonitorUiDialog.Body>
        <p>{backOffice.dialogMessage}</p>
      </MonitorUiDialog.Body>
      <MonitorUiDialog.Action>
        <Button onClick={close}>Fermer</Button>
      </MonitorUiDialog.Action>
    </MonitorUiDialog>
  )
}
