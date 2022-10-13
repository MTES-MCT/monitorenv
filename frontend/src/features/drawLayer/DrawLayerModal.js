import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { matchPath } from 'react-router-dom'
import styled from 'styled-components'

import { COLORS } from '../../constants/constants'
import { monitorenvFeatureTypes, interactionTypes } from '../../domain/entities/drawLayer'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import {
  quitAddLocalisation,
  validateLocalisation
} from '../../domain/use_cases/missions/missionAndControlLocalisation'
import { usePrevious } from '../../hooks/usePrevious'
import { ReactComponent as CircleSVG } from '../../uiMonitor/icons/Info.svg'
import { ReactComponent as PolygonSVG } from '../../uiMonitor/icons/Polygone.svg'
import { ReactComponent as RectangleSVG } from '../../uiMonitor/icons/Rectangle.svg'
import { ReactComponent as SelectorSVG } from '../../uiMonitor/icons/Selector.svg'
import { resetFeatures, setInteractionType } from './DrawLayer.slice'

const titlePlaceholder = {
  ACTION_LOCALISATION: 'un point de contrôle',
  MISSION_ZONE: 'une zone de mission'
}
const validateButtonPlaceholder = {
  ACTION_LOCALISATION: 'le point de contrôle',
  MISSION_ZONE: 'la zone de mission'
}

export function DrawLayerModal() {
  const dispatch = useDispatch()
  const { featureType, interactionType } = useSelector(state => state.drawLayer)

  const { sideWindowIsOpen } = useSelector(state => state.global)
  const { sideWindowPath } = useSelector(state => state.sideWindowRouter)

  const routeParams = matchPath(sideWindowPath, {
    exact: true,
    path: [sideWindowPaths.MISSION, sideWindowPaths.MISSION_NEW],
    strict: true
  })
  const previousMissionId = usePrevious(routeParams?.params?.id)

  useEffect(() => {
    if (previousMissionId && previousMissionId != routeParams?.params?.id) {
      dispatch(quitAddLocalisation)
    }
  }, [previousMissionId, routeParams])

  useEffect(() => {
    !sideWindowIsOpen && dispatch(quitAddLocalisation)
  }, [sideWindowIsOpen])

  const handleQuit = () => {
    dispatch(quitAddLocalisation)
  }
  const handleSelectInteraction = selectedInteraction => () => {
    dispatch(setInteractionType(selectedInteraction))
  }
  const handleReset = () => {
    dispatch(resetFeatures())
  }
  const handleValidate = () => {
    dispatch(validateLocalisation)
  }

  return (
    <Wrapper>
      <ContentWrapper>
        <Header>
          Vous êtes en train d&apos;ajouter {titlePlaceholder[featureType]}
          <QuitButton onClick={handleQuit} type="button">
            Quitter
          </QuitButton>
        </Header>
        <ActionWrapper>
          <ResetButton onClick={handleReset}>Réinitialiser</ResetButton>
          <ValidateButton onClick={handleValidate}>Valider {validateButtonPlaceholder[featureType]}</ValidateButton>
        </ActionWrapper>
      </ContentWrapper>
      {featureType === monitorenvFeatureTypes.MISSION_ZONE && (
        <ButtonsWrapper>
          <Button
            onClick={handleSelectInteraction(interactionTypes.POLYGON)}
            selected={interactionType === interactionTypes.POLYGON}
          >
            <PolygonIcon />
          </Button>
          <Button
            onClick={handleSelectInteraction(interactionTypes.SQUARE)}
            selected={interactionType === interactionTypes.SQUARE}
          >
            <RectangleIcon />
          </Button>
          <Button
            onClick={handleSelectInteraction(interactionTypes.CIRCLE)}
            selected={interactionType === interactionTypes.CIRCLE}
          >
            <CircleIcon />
          </Button>
          <Button selected={interactionType === interactionTypes.SELECTION}>
            <SelectorIcon />
          </Button>
        </ButtonsWrapper>
      )}
    </Wrapper>
  )
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
  background: ${props => (props.selected ? COLORS.blueYonder : COLORS.charcoal)};
  :hover,
  :focus {
    background: ${COLORS.blueYonder};
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
  color: ${COLORS.maximumRed};
  background: ${COLORS.cultured};
  padding-right: 18px;
  padding-left: 18px;
  padding-top: 3px;
  padding-bottom: 3px;
  margin-left: 18px;
`
const ResetButton = styled.button`
  background: ${COLORS.blueYonder};
  color: ${COLORS.white};
  font-weight: bold;
  font-size: 13px;
  line-height: 18px;
  padding: 8px;
`
const ValidateButton = styled.button`
  background: ${COLORS.mediumSeaGreen};
  color: ${COLORS.white};
  font-weight: bold;
  line-height: 18px;
  padding: 8px;
`
const ActionWrapper = styled.div``
