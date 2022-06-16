import React from 'react'
import { Modal } from 'rsuite'
import styled from 'styled-components'
import { PrimaryButton, SecondaryButton } from '../commonStyles/Buttons.style'


export const MissionValidationModal = ()=>{
  return (<Modal>
    <AlertTitle>Vous êtes en train d&apos;abandonner l&apos;ajout d&apos;une nouvelle mission</AlertTitle>
    <AlertQuestion>Voulez-vous enregistrer les modifications avant de quitter ?</AlertQuestion>
    <ButtonsWrapper>
      <SecondaryButton>Fermer sans enregistrer</SecondaryButton>
      <PrimaryButton>Enregistrer et quitter</PrimaryButton>
    </ButtonsWrapper>
  </Modal>)
}

const AlertTitle = styled.h3`
`

const AlertQuestion = styled.h3`
  font-weight: bolder;
`

const ButtonsWrapper = styled.div``
