import { VigilanceArea } from '@features/VigilanceArea/types'
import { Accent, Button, Icon, IconButton, Label, Size, TextInput } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import { useState } from 'react'
import styled from 'styled-components'

export function Links() {
  const { setFieldValue } = useFormikContext<VigilanceArea.VigilanceArea>()
  const [field] = useField<Array<VigilanceArea.Link>>('links')
  const [isCreatingLink, setIsCreatingLink] = useState<number | undefined>(undefined)
  const [creatingLink, setCreatingLink] = useState<VigilanceArea.Link | undefined>(undefined)

  const addLink = () => {
    setCreatingLink({
      linkText: undefined,
      linkUrl: undefined
    })
    // for a new link, we set the index to -1
    setIsCreatingLink(-1)
  }

  const setCurrentLink = (nextValue: string | undefined, currentField: string) => {
    setCreatingLink({ ...creatingLink, [currentField]: nextValue })
  }

  const validateLink = () => {
    if (creatingLink?.linkText && creatingLink?.linkUrl && isCreatingLink !== undefined) {
      if (isCreatingLink === -1) {
        setFieldValue('links', [...(field.value ?? []), creatingLink])
        setIsCreatingLink(undefined)
        setCreatingLink(undefined)

        return
      }

      const updatedLinks = [...field.value]
      updatedLinks.splice(isCreatingLink, 1, creatingLink)
      setFieldValue('links', [...updatedLinks])
      setIsCreatingLink(undefined)
      setCreatingLink(undefined)
    }
  }

  const cancelAddLink = () => {
    setIsCreatingLink(undefined)
    setCreatingLink(undefined)
  }

  const editLink = (link: VigilanceArea.Link, index: number) => {
    setIsCreatingLink(index)
    setCreatingLink(link)
  }

  const deleteLink = (index: number) => {
    const updatedLinks = [...field.value]
    updatedLinks.splice(index, 1)
    setFieldValue('links', [...updatedLinks])
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
      {creatingLink && (
        <CreateLinkContainer>
          <TextInput
            isLight
            label="Texte à afficher"
            name="addLinkText"
            onChange={nextValue => setCurrentLink(nextValue, 'linkText')}
            value={creatingLink?.linkText}
          />
          <TextInput
            isLight
            label="Url du lien"
            name="addLinkUrl"
            onChange={nextValue => setCurrentLink(nextValue, 'linkUrl')}
            value={creatingLink?.linkUrl}
          />
          <ButtonsContainer>
            <Button accent={Accent.SECONDARY} onClick={cancelAddLink} size={Size.SMALL}>
              Annuler
            </Button>
            <Button disabled={!creatingLink.linkText || !creatingLink.linkUrl} onClick={validateLink} size={Size.SMALL}>
              Valider
            </Button>
          </ButtonsContainer>
        </CreateLinkContainer>
      )}

      {(field.value ?? []).map((link, index) => (
        <LinkContainer key={`${link.linkUrl}${link.linkText}`}>
          <StyledLink href={link.linkUrl} rel="noreferrer" target="_blank">
            {link.linkText}
          </StyledLink>
          <IconButton accent={Accent.SECONDARY} Icon={Icon.Delete} onClick={() => deleteLink(index)} />
          <IconButton accent={Accent.SECONDARY} Icon={Icon.Edit} onClick={() => editLink(link, index)} />
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
