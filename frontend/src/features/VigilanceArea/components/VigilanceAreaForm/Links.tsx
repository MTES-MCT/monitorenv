import { Accent, Button, Icon, Label, TextInput } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useState } from 'react'
import styled from 'styled-components'

export function Links() {
  const [field] = useField('links')
  const [isAddingLink, setIsAddingLink] = useState(false)

  const addLink = () => {
    setIsAddingLink(true)
  }

  return (
    <>
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
      {isAddingLink && (
        <CreateLinkContainer>
          <TextInput isTransparent label="Texte à afficher" name="linkText" />
          <TextInput label="Url du lien" name="linkUrl" />
        </CreateLinkContainer>
      )}

      {field.value?.map(link => (
        <LinkContainer key={link}>
          <a href={link} rel="noreferrer" target="_blank">
            {link}
          </a>
        </LinkContainer>
      ))}
    </>
  )
}

const CreateLinkContainer = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  padding: 8px 16px;
`
const LinkContainer = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
`
