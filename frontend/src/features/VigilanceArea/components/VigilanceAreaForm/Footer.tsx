import { Accent, Button, Icon, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type VigilanceAreaFormFooterProps = {
  isDraft: boolean
  onCancel: () => void
  onDelete: () => void
  onPublish: () => void
  onSave: () => void
}

export function Footer({ isDraft, onCancel, onDelete, onPublish, onSave }: VigilanceAreaFormFooterProps) {
  return (
    <FooterContainer>
      <DeleteButton accent={Accent.SECONDARY} Icon={Icon.Delete} onClick={onDelete} size={Size.SMALL}>
        Supprimer
      </DeleteButton>
      <LeftButtons>
        <Button accent={Accent.SECONDARY} onClick={onCancel} size={Size.SMALL}>
          Annuler
        </Button>
        <Button accent={Accent.SECONDARY} onClick={onSave} size={Size.SMALL}>
          Enregistrer
        </Button>
        <Button disabled={!isDraft} onClick={onPublish} size={Size.SMALL}>
          {isDraft ? 'Publier' : 'Publiée'}
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
const DeleteButton = styled(Button)`
  > span {
    color: ${p => p.theme.color.maximumRed};
  }
`
const LeftButtons = styled.div`
  display: flex;
  gap: 8px;
`
