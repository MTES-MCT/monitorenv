import { Accent, Button, Icon, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type VigilanceAreaFormFooterProps = {
  onCancel: () => void
  onDelete: () => void
  onPublish: () => void
  onSave: () => void
}

export function Footer({ onCancel, onDelete, onPublish, onSave }: VigilanceAreaFormFooterProps) {
  return (
    <FooterContainer>
      <Button accent={Accent.SECONDARY} Icon={Icon.Delete} onClick={onDelete} size={Size.SMALL}>
        Supprimer
      </Button>
      <LeftButtons>
        <Button accent={Accent.SECONDARY} onClick={onCancel} size={Size.SMALL}>
          Annuler
        </Button>
        <Button accent={Accent.SECONDARY} onClick={onSave} size={Size.SMALL}>
          Enregistrer
        </Button>
        <Button onClick={onPublish} size={Size.SMALL}>
          Publier
        </Button>
      </LeftButtons>
    </FooterContainer>
  )
}

const FooterContainer = styled.footer`
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  justify-content: space-between;
  padding: 12px 8px;
  height: 48px;
`

const LeftButtons = styled.div`
  display: flex;
  gap: 8px;
`
