import { Button, Dialog, Icon, THEME } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import styled from 'styled-components'

import { MissionSourceEnum } from '../../../../domain/entities/missions'

type ExternalActionsModalProps = {
  onClose: () => void
  sources: MissionSourceEnum[]
}

export function ExternalActionsModal({ onClose, sources }: ExternalActionsModalProps) {
  const isCNSP = sources.includes(MissionSourceEnum.MONITORFISH)
  const isRapportNav = sources.includes(MissionSourceEnum.RAPPORT_NAV)

  const sourceText = useMemo(() => {
    if (isCNSP && !isRapportNav) {
      return 'le CNSP'
    }

    if (!isCNSP && isRapportNav) {
      return "l'unité"
    }

    return "le CNSP et l'unité"
  }, [isCNSP, isRapportNav])

  return (
    <Dialog data-cy="external-actions-modal" isAbsolute>
      <Dialog.Title>Suppression impossible</Dialog.Title>
      <Dialog.Body>
        <Alert>
          <Icon.Attention color={THEME.color.maximumRed} size={30} />
        </Alert>
        <Text data-cy="external-action-modal-text">{`La mission ne peut pas être supprimée, car elle comporte des événements ajoutés par ${sourceText}.`}</Text>
        <Bold>
          {`Si vous souhaitez tout de même la supprimer, veuillez contacter ${sourceText} pour qu'${
            isCNSP && isRapportNav ? 'ils suppriment' : 'il supprime'
          } d'abord
            ses événements.`}
        </Bold>
      </Dialog.Body>

      <Dialog.Action>
        <Button data-cy="external-actions-modal-close" onClick={onClose}>
          Fermer
        </Button>
      </Dialog.Action>
    </Dialog>
  )
}

const Alert = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`
const Text = styled.p`
  color: ${props => props.theme.color.maximumRed} !important;
  padding: 0px 40px;
`
const Bold = styled(Text)`
  font-weight: bold;
`
