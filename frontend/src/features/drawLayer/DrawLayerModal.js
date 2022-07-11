import React from 'react'
import styled from 'styled-components'

import { ReactComponent as PolygonSVG } from '../icons/polygone.svg'
import { ReactComponent as RectangleSVG } from '../icons/rectangle.svg'
import { ReactComponent as CircleSVG } from '../icons/cercle-1.svg'
import { ReactComponent as SelectorSVG } from '../icons/selector.svg'

import { COLORS } from '../../constants/constants'
import { useDispatch, useSelector } from 'react-redux'
import { resetFeatures, setInteractionType } from './DrawLayer.slice'
import { monitorenvFeatureTypes, interactionTypes } from '../../domain/entities/drawLayer'
import { quitAddLocalisation, validateLocalisation } from '../../domain/use_cases/missionAndControlLocalisation'

const titlePlaceholder = {
  MISSION_ZONE: 'une zone de mission',
  ACTION_LOCALISATION: 'un point de contrôle'
}
const validateButtonPlaceholder = {
  MISSION_ZONE: 'la zone de mission',
  ACTION_LOCALISATION: 'le point de contrôle'
}

export const DrawLayerModal = () => {
  const dispatch = useDispatch()
  const { interactionType, featureType } = useSelector(state => state.drawLayer)
  const handleQuit = () => {
    dispatch(quitAddLocalisation)
  }
  const handleSelectInteraction = (selectedInteraction) => () => {
    dispatch(setInteractionType(selectedInteraction))
  }
  const handleReset = () => {
    dispatch(resetFeatures())
  }
  const handleValidate = () => {
    dispatch(validateLocalisation)
  }
  return (<Wrapper>
    <ContentWrapper>
      <Header>
        Vous êtes en train d&apos;ajouter {titlePlaceholder[featureType]}
        <QuitButton onClick={handleQuit} type={'button'}>Quitter</QuitButton>
      </Header>
      <ActionWrapper>
      <ResetButton onClick={handleReset}>Réinitialiser</ResetButton>
      <ValidateButton onClick={handleValidate}>Valider {validateButtonPlaceholder[featureType]}</ValidateButton>
    </ActionWrapper>
    </ContentWrapper>
    { featureType === monitorenvFeatureTypes.MISSION_ZONE && 
      <ButtonsWrapper>
        <Button selected={interactionType === interactionTypes.POLYGON} onClick={handleSelectInteraction(interactionTypes.POLYGON)}><PolygonIcon /></Button>
        <Button selected={interactionType === interactionTypes.SQUARE} onClick={handleSelectInteraction(interactionTypes.SQUARE)}><RectangleIcon /></Button>
        <Button selected={interactionType === interactionTypes.CIRCLE} onClick={handleSelectInteraction(interactionTypes.CIRCLE)}><CircleIcon /></Button>
        <Button selected={interactionType === interactionTypes.SELECTION}><SelectorIcon /></Button>
      </ButtonsWrapper>}
    
  </Wrapper>)
}

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  margin-left: calc(50% - 225px);
  margin-right: calc(50% - 225px);
  display: flex;
`
const ContentWrapper = styled.div``
const ButtonsWrapper = styled.div`
  margin-left: 3px;
  button {
    :not(:last-child) {
      margin-bottom: 3px;
    }
  }
`

const Header = styled.h1`
  background: ${COLORS.charcoal};
  width: 550px;
  color: ${COLORS.white};
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  padding: 14px;
`
const Button = styled.button`
  width: 32px;
  height: 32px;
  background: ${props=> props.selected ? COLORS.shadowBlue : COLORS.charcoal};
  :hover, :focus {
    background: ${COLORS.shadowBlue};
  }
`
const PolygonIcon = styled(PolygonSVG)`
  width: 16px;
  height: 16px;
`
const CircleIcon = styled(CircleSVG)`
  width: 16px;
  height: 16px;
`
const RectangleIcon = styled(RectangleSVG)`
  width: 16px;
  height: 16px;
`
const SelectorIcon = styled(SelectorSVG)`
  width: 16px;
  height: 16px;
`
const QuitButton = styled.button`
  display: inline-block;
  color: ${COLORS.red};
  background: ${COLORS.grayLighter};
  padding-right: 18px;
  padding-left: 18px;
  padding-top: 3px;
  padding-bottom: 3px;
  margin-left: 18px;
`
const ResetButton = styled.button`
  background: ${COLORS.shadowBlue};
  color: ${COLORS.white};
  font-weight: bold;
  font-size: 13px;
  line-height: 18px;
  padding: 8px;
`
const ValidateButton = styled.button`
  background: ${COLORS.missingGreen};
  color: ${COLORS.white};
  font-weight: bold;
  line-height: 18px;
  padding: 8px;
`
const ActionWrapper = styled.div``
