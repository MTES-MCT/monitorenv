import { Accent, Button, Icon, IconButton, Label, Size, TextInput } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

import type { Link } from '../types'

type LinkComponentProps = {
  links?: Link[]
  onDelete: (links: Link[]) => void
  onValidate: (links: Link[]) => void
}

export function Links({ links, onDelete, onValidate }: LinkComponentProps) {
  const [linkIndex, setLinkIndex] = useState<number | undefined>(undefined)
  const [currentLink, setCurrentLink] = useState<Link | undefined>(undefined)

  const addLink = () => {
    setCurrentLink({
      linkText: undefined,
      linkUrl: undefined
    })
    // for a new link, we set the index to -1
    setLinkIndex(-1)
  }

  const validateLink = () => {
    if (currentLink?.linkText && currentLink?.linkUrl && linkIndex !== undefined) {
      if (linkIndex === -1) {
        onValidate([...(links ?? []), currentLink])
      } else {
        const updatedLinks = links?.map((link, index) => (index === linkIndex ? currentLink : link)) ?? []

        onValidate(updatedLinks)
      }

      setLinkIndex(undefined)
      setCurrentLink(undefined)
    }
  }

  const cancelAddLink = () => {
    setLinkIndex(undefined)
    setCurrentLink(undefined)
  }

  const editLink = (link: Link, index: number) => {
    setLinkIndex(index)
    setCurrentLink(link)
  }

  const deleteLink = (index: number) => {
    const deletedLinks = links?.filter((_, i) => i !== index) ?? []
    onDelete(deletedLinks)
  }

  return (
    <LinksContainer>
      <div>
        <Label>Liens utiles</Label>
        <Button accent={Accent.SECONDARY} Icon={Icon.Plus} isFullWidth onClick={addLink} title="Ajouter un lien utile">
          Ajouter un lien utile
        </Button>
      </div>
      {currentLink && (
        <CreateLinkContainer>
          <TextInput
            isLight
            label="Texte à afficher"
            name="addLinkText"
            onChange={nextValue => setCurrentLink({ ...currentLink, linkText: nextValue })}
            value={currentLink?.linkText}
          />
          <TextInput
            isLight
            label="Url du lien"
            name="addLinkUrl"
            onChange={nextValue => setCurrentLink({ ...currentLink, linkUrl: nextValue })}
            value={currentLink?.linkUrl}
          />
          <ButtonsContainer>
            <Button accent={Accent.SECONDARY} onClick={cancelAddLink} size={Size.SMALL}>
              Annuler
            </Button>
            <Button disabled={!currentLink.linkText || !currentLink.linkUrl} onClick={validateLink} size={Size.SMALL}>
              Valider
            </Button>
          </ButtonsContainer>
        </CreateLinkContainer>
      )}

      {links?.map((link, index) => (
        <LinkContainer key={`${link.linkUrl}${link.linkText}`}>
          <StyledLink data-cy={`link-${index}`} href={link.linkUrl} rel="noreferrer" target="_blank">
            {link.linkText}
          </StyledLink>
          <IconButton
            accent={Accent.SECONDARY}
            Icon={Icon.Delete}
            onClick={() => deleteLink(index)}
            title="Supprimer ce lien"
          />
          <IconButton
            accent={Accent.SECONDARY}
            Icon={Icon.Edit}
            onClick={() => editLink(link, index)}
            title="Éditer ce lien"
          />
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
  overflow: hidden;
  padding: 6px 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const ButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
  align-self: flex-end;
`
