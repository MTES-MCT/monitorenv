import { Accent, Button, Dialog, Icon, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { MissionSourceEnum } from '../../../domain/entities/missions'

type ExternalActionsModalProps = {
  onCancel: () => void
  onConfirm: () => void
  open: boolean
  sources: MissionSourceEnum[]
}

export function ExternalActionsModal({ onCancel, onConfirm, open, sources }: ExternalActionsModalProps) {
  const isCNSP = sources.includes(MissionSourceEnum.MONITORFISH)

  return (
    open && (
      <Dialog data-cy="external-actions-modal" isAbsolute>
        <Dialog.Title>Demande de suppression de mission</Dialog.Title>
        <Dialog.Body>
          <Alert>
            <Icon.Attention color={THEME.color.maximumRed} size={30} />
          </Alert>
          <Text>{`La mission comporte des évènements ajoutés par ${isCNSP ? 'le CNSP' : ''}.`}</Text>
          <Bold>Avez-vous vérifié auprès du centre que la mission pouvait tout de même être supprimée ?</Bold>
        </Dialog.Body>

        <Dialog.Action>
          <Button accent={Accent.PRIMARY} name="external-actions-modal-cancel" onClick={onConfirm}>
            Oui, supprimer
          </Button>
          <Button accent={Accent.SECONDARY} name="external-actions-modal-confirm" onClick={onCancel}>
            Non, annuler
          </Button>
        </Dialog.Action>
      </Dialog>
    )
  )
}

const Alert = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`
const Text = styled.p`
  color: ${props => props.theme.color.maximumRed} !important;
`
const Bold = styled.p`
  color: ${props => props.theme.color.maximumRed} !important;
  font-weight: bold;
`
