import { Accent, Button, Icon, Size } from '@mtes-mct/monitor-ui'

import { DeleteButton, FooterContainer, FooterRightButtons } from './style'

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
      <FooterRightButtons>
        <Button accent={Accent.SECONDARY} onClick={onCancel} size={Size.SMALL}>
          Annuler
        </Button>
        <Button accent={Accent.SECONDARY} onClick={onSave} size={Size.SMALL}>
          Enregistrer
        </Button>
        <Button disabled={!isDraft} onClick={onPublish} size={Size.SMALL}>
          {isDraft ? 'Publier' : 'Publiée'}
        </Button>
      </FooterRightButtons>
    </FooterContainer>
  )
}
