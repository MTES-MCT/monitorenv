import { Dialog } from '@mtes-mct/monitor-ui'
import { Button } from 'rsuite'

export function ReopenModal({ onCancel, onConfirm, open }) {
  return (
    open && (
      <Dialog isAbsolute>
        <Dialog.Title>Rouvrir la mission et enregistrer les modifications ?</Dialog.Title>
        <Dialog.Body>
          <p>Des modifications ont été apportées au formulaire.</p>
          <p>
            <b>Si vous rouvrez la mission, ces modifications seront enregistrées</b>.
          </p>
        </Dialog.Body>

        <Dialog.Action>
          <Button appearance="ghost" onClick={onCancel}>
            Annuler
          </Button>
          <Button appearance="primary" onClick={onConfirm}>
            Enregistrer et rouvrir
          </Button>
        </Dialog.Action>
      </Dialog>
    )
  )
}
