import { Button } from 'rsuite'

import { Dialog } from '../../uiMonitor/Dialog'

export function MissionDeleteModal({ onCancel, onConfirm, open }) {
  return (
    open && (
      <Dialog isAbsolute>
        <Dialog.Title>Enregistrer les modifications ?</Dialog.Title>
        <Dialog.Body>
          <p>Êtes-vous sûr de vouloir supprimer la mission ?</p>
        </Dialog.Body>

        <Dialog.Action>
          <Button appearance="ghost" onClick={onCancel}>
            Retourner à l&apos;édition
          </Button>
          <Button appearance="primary" onClick={onConfirm}>
            Confirmer la suppression
          </Button>
        </Dialog.Action>
      </Dialog>
    )
  )
}
