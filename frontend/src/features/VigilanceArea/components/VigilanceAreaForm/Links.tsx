import { Accent, Button, Icon, IconButton, Label, Size, TextInput } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useState } from 'react'
import styled from 'styled-components'

export function Links() {
  const [field] = useField('links')
  const [isAddingLink, setIsAddingLink] = useState(false)

  /*   const testLinks = [
    {
      linkText: 'Google',
      linkUrl: 'https://www.google.com'
    },
    {
      linkText: 'Facebook',

      linkUrl: 'https://www.facebook.com'
    }
  ] */
  const addLink = () => {
    setIsAddingLink(true)
  }

  const cancelAddLink = () => {
    setIsAddingLink(false)
  }

  return (
    <LinksContainer>
      <div>
        <Label>Liens utiles</Label>
        <Button
          accent={Accent.SECONDARY}
          aria-label="Ajouter un lien utile"
          Icon={Icon.Plus}
          isFullWidth
          onClick={addLink}
        >
          Ajouter un lien utile
        </Button>
      </div>
      {isAddingLink && (
        <CreateLinkContainer>
          <TextInput isLight label="Texte à afficher" name="linkText" />
          <TextInput isLight label="Url du lien" name="linkUrl" />
          <ButtonsContainer>
            <Button accent={Accent.SECONDARY} onClick={cancelAddLink} size={Size.SMALL}>
              Annuler
            </Button>
            <Button size={Size.SMALL}>Valider</Button>
          </ButtonsContainer>
        </CreateLinkContainer>
      )}

      {field.value?.map(link => (
        <LinkContainer key={link.linkUrl}>
          <StyledLink href={link.linkUrl} rel="noreferrer" target="_blank">
            {link.linkText}
          </StyledLink>
          <IconButton accent={Accent.SECONDARY} Icon={Icon.Delete} />
          <IconButton accent={Accent.SECONDARY} Icon={Icon.Edit} />
        </LinkContainer>
      ))}
    </LinksContainer>
  )
}

const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const CreateLinkContainer = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 12px;
`
const LinkContainer = styled.div`
  display: flex;
  flex: 1;
  gap: 4px;
`

const StyledLink = styled.a`
  background-color: ${p => p.theme.color.gainsboro};
  flex: 1;
  padding: 6px 12px;
`
const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  align-self: flex-end;
`
