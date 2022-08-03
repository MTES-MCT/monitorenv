import React from 'react'
import { Modal, Button } from 'rsuite'
import styled from 'styled-components'


export const MissionValidationModal = ()=>{
  return (<Modal>
    <AlertTitle>Vous êtes en train d&apos;abandonner l&apos;ajout d&apos;une nouvelle mission</AlertTitle>
    <AlertQuestion>Voulez-vous enregistrer les modifications avant de quitter ?</AlertQuestion>
    <ButtonsWrapper>
      <Button appearance='ghost'>Fermer sans enregistrer</Button>
      <Button>Enregistrer et quitter</Button>
    </ButtonsWrapper>
  </Modal>)
}

const AlertTitle = styled.h3`
`

const AlertQuestion = styled.h3`
  font-weight: bolder;
`

const ButtonsWrapper = styled.div``
