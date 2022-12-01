import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { matchPath } from 'react-router-dom'
import { Button, IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../constants/constants'
import { monitorenvFeatureTypes, interactionTypes } from '../../domain/entities/drawLayer'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import {
  quitAddLocalisation,
  validateLocalisation
} from '../../domain/use_cases/missions/missionAndControlLocalisation'
import { useAppSelector } from '../../hooks/useAppSelector'
import { usePrevious } from '../../hooks/usePrevious'
import { ReactComponent as CloseSVG } from '../../uiMonitor/icons/Close.svg'
import { ReactComponent as CircleSVG } from '../../uiMonitor/icons/Info.svg'
import { ReactComponent as PolygonSVG } from '../../uiMonitor/icons/Polygone.svg'
import { ReactComponent as RectangleSVG } from '../../uiMonitor/icons/Rectangle.svg'
import { ReactComponent as SelectorSVG } from '../../uiMonitor/icons/Selector.svg'
import { popLastFeature, setInteractionType } from './DrawLayer.slice'

const titlePlaceholder = {
  CONTROL_POINT: 'un point de contrôle',
  MISSION_ZONE: 'une zone de mission',
  SURVEILLANCE_ZONE: 'une zone de surveillance'
}
const validateButtonPlaceholder = {
  CONTROL_POINT: 'le point de contrôle',
  MISSION_ZONE: 'la zone de mission',
  SURVEILLANCE_ZONE: 'la zone de surveillance'
}

export function DrawLayerModal() {
  const dispatch = useDispatch()
  const { featureType, interactionType } = useAppSelector(state => state.drawLayer)

  const { sideWindowIsLoaded, sideWindowPath } = useAppSelector(state => state.sideWindowRouter)

  const routeParams = matchPath<{ id: string }>(sideWindowPath, {
    exact: true,
    path: [sideWindowPaths.MISSION, sideWindowPaths.MISSION_NEW],
    strict: true
  })
  const previousMissionId = usePrevious(routeParams?.params?.id)

  useEffect(() => {
    if (previousMissionId && previousMissionId !== routeParams?.params?.id) {
      dispatch(quitAddLocalisation)
    }
  }, [dispatch, previousMissionId, routeParams])

  useEffect(() => {
    if (!sideWindowIsLoaded) {
      dispatch(quitAddLocalisation)
    }
  }, [dispatch, sideWindowIsLoaded])

  const handleQuit = () => {
    dispatch(quitAddLocalisation)
  }
  const handleSelectInteraction = selectedInteraction => () => {
    dispatch(setInteractionType(selectedInteraction))
  }
  const handleReset = () => {
    dispatch(popLastFeature())
  }
  const handleValidate = () => {
    dispatch(validateLocalisation)
  }

  return (
    <Wrapper>
      <ContentWrapper>
        <Header>
          Vous êtes en train d&apos;ajouter {featureType && titlePlaceholder[featureType]}
          <QuitButton icon={<CloseSVG className="rs-icon" />} onClick={handleQuit} size="md">
            Quitter
          </QuitButton>
        </Header>
        <ActionWrapper>
          {featureType === monitorenvFeatureTypes.MISSION_ZONE && (
            <>
              <IconButton
                active={interactionType === interactionTypes.POLYGON}
                appearance="primary"
                icon={<PolygonIcon className="rs-icon" />}
                onClick={handleSelectInteraction(interactionTypes.POLYGON)}
                size="md"
              />
              <IconButton
                active={interactionType === interactionTypes.SQUARE}
                appearance="primary"
                icon={<RectangleIcon className="rs-icon" />}
                onClick={handleSelectInteraction(interactionTypes.SQUARE)}
                size="md"
              />
              <IconButton
                active={interactionType === interactionTypes.CIRCLE}
                appearance="primary"
                icon={<CircleIcon className="rs-icon" />}
                onClick={handleSelectInteraction(interactionTypes.CIRCLE)}
                size="md"
              />
              <IconButton
                active={interactionType === interactionTypes.SELECTION}
                appearance="primary"
                icon={<SelectorIcon className="rs-icon" />}
                size="md"
              />
            </>
          )}
          <ResetButton appearance="ghost" onClick={handleReset}>
            Réinitialiser
          </ResetButton>
          <ValidateButton onClick={handleValidate}>
            Valider {featureType && validateButtonPlaceholder[featureType]}
          </ValidateButton>
        </ActionWrapper>
      </ContentWrapper>
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

const Header = styled.h1`
  background: ${COLORS.charcoal};
  width: 550px;
  color: ${COLORS.white};
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  padding: 10px;
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
const QuitButton = styled(IconButton)`
  color: ${COLORS.maximumRed};
  background: ${COLORS.cultured};
  margin-left: 18px;
  &:hover {
    color: ${COLORS.maximumRed};
    background: ${COLORS.cultured};
  }
`

const ResetButton = styled(Button)``
const ValidateButton = styled(Button)`
  background: ${COLORS.mediumSeaGreen};
  color: ${COLORS.white};
  &:hover {
    background: ${COLORS.mediumSeaGreen};
  }
`
const ActionWrapper = styled.div`
  padding: 10px;
  background-color: ${COLORS.white};
  & > :not(:last-child) {
    margin-right: 10px;
  }
`
