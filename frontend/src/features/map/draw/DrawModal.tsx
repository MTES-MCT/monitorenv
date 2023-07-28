import { Coordinates, CoordinatesInput } from '@mtes-mct/monitor-ui'
import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import Point from 'ol/geom/Point'
import { transform } from 'ol/proj'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Button, IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import {
  InteractionListener,
  InteractionType,
  OLGeometryType,
  OPENLAYERS_PROJECTION,
  WSG84_PROJECTION
} from '../../../domain/entities/map/constants'
import { setInteractionType } from '../../../domain/shared_slices/Draw'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { addFeatureToDrawedFeature } from '../../../domain/use_cases/draw/addFeatureToDrawedFeature'
import { eraseDrawedGeometries } from '../../../domain/use_cases/draw/eraseDrawedGeometries'
import { closeAddZone } from '../../../domain/use_cases/missions/closeAddZone'
import { validateZone } from '../../../domain/use_cases/missions/validateZone'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { usePrevious } from '../../../hooks/usePrevious'
import { ReactComponent as CloseSVG } from '../../../uiMonitor/icons/Close.svg'
import { ReactComponent as CircleSVG } from '../../../uiMonitor/icons/Info.svg'
import { ReactComponent as PolygonSVG } from '../../../uiMonitor/icons/Polygone.svg'
import { ReactComponent as RectangleSVG } from '../../../uiMonitor/icons/Rectangle.svg'
import { ReactComponent as SelectorSVG } from '../../../uiMonitor/icons/Selector.svg'
import { getMissionPageRoute } from '../../../utils/getMissionPageRoute'
import { SideWindowStatus } from '../../SideWindow/slice'

import type { MultiPoint, MultiPolygon } from 'ol/geom'

const titlePlaceholder = {
  CONTROL_POINT: 'un point de contrôle',
  MISSION_ZONE: 'une zone de mission',
  REPORTING_POINT: 'un point de signalement',
  REPORTING_ZONE: 'une zone de signalement',
  SURVEILLANCE_ZONE: 'une zone de surveillance'
}
const validateButtonPlaceholder = {
  CONTROL_POINT: 'le point de contrôle',
  MISSION_ZONE: 'la zone de mission',
  REPORTING_POINT: 'le point',
  REPORTING_ZONE: 'la zone',
  SURVEILLANCE_ZONE: 'la zone de surveillance'
}

export function DrawModal() {
  const dispatch = useAppDispatch()
  const { coordinatesFormat } = useAppSelector(state => state.map)
  const { geometry, interactionType, isGeometryValid, listener } = useAppSelector(state => state.draw)

  const { sideWindow } = useAppSelector(state => state)

  const initialFeatureNumberRef = useRef<number | undefined>(undefined)

  const routeParams = getMissionPageRoute(sideWindow.currentPath)

  const previousMissionId = usePrevious(routeParams?.params?.id)

  const feature = useMemo(() => {
    if (!geometry) {
      return undefined
    }

    return new GeoJSON({
      featureProjection: OPENLAYERS_PROJECTION
    }).readFeature(geometry)
  }, [geometry])

  useEffect(() => {
    if (initialFeatureNumberRef.current !== undefined) {
      return
    }

    if (!feature) {
      initialFeatureNumberRef.current = 0

      return
    }
    const geomType = feature.getGeometry()?.getType()
    switch (geomType) {
      case OLGeometryType.MULTIPOLYGON:
        initialFeatureNumberRef.current = (feature.getGeometry() as MultiPolygon).getPolygons().length
        break
      case OLGeometryType.MULTIPOINT:
        initialFeatureNumberRef.current = (feature.getGeometry() as MultiPoint).getPoints().length
        break
      default:
        initialFeatureNumberRef.current = 0
        break
    }
  }, [feature])

  useEffect(() => {
    if (listener === InteractionListener.REPORTING_ZONE || listener === InteractionListener.REPORTING_POINT) {
      return
    }
    if (previousMissionId && previousMissionId !== routeParams?.params?.id) {
      dispatch(closeAddZone())
    }
  }, [listener, dispatch, previousMissionId, routeParams])

  useEffect(() => {
    if (
      sideWindow.status === SideWindowStatus.CLOSED &&
      listener !== InteractionListener.REPORTING_ZONE &&
      listener !== InteractionListener.REPORTING_POINT
    ) {
      dispatch(closeAddZone())
    }
  }, [dispatch, listener, sideWindow.status])

  const handleQuit = () => {
    dispatch(closeAddZone())
  }
  const handleSelectInteraction = nextInteraction => () => {
    dispatch(setInteractionType(nextInteraction))
  }
  const handleReset = () => {
    dispatch(eraseDrawedGeometries(initialFeatureNumberRef.current))
  }
  const handleValidate = () => {
    dispatch(validateZone())
  }

  const handleSelectCoordinates = useCallback(
    (nextCoordinates: Coordinates | undefined) => {
      if (!nextCoordinates) {
        return
      }

      const [latitude, longitude] = nextCoordinates
      if (!latitude || !longitude) {
        return
      }

      const nextTransformedCoordinates = transform([longitude, latitude], WSG84_PROJECTION, OPENLAYERS_PROJECTION)
      const nextFeature = new Feature({
        geometry: new Point(nextTransformedCoordinates)
      })

      dispatch(addFeatureToDrawedFeature(nextFeature))
      dispatch(setFitToExtent(nextFeature.getGeometry()?.getExtent()))
    },
    [dispatch]
  )

  return (
    <Wrapper>
      <Panel>
        <Header>
          Vous êtes en train d&apos;ajouter {listener && titlePlaceholder[listener]}
          <QuitButton icon={<CloseSVG className="rs-icon" />} onClick={handleQuit} size="md">
            Quitter
          </QuitButton>
        </Header>
        <Body>
          {(listener === InteractionListener.CONTROL_POINT || listener === InteractionListener.REPORTING_POINT) && (
            <CoordinatesInputWrapper>
              <CoordinatesInput
                coordinatesFormat={coordinatesFormat}
                defaultValue={undefined}
                isLabelHidden
                isLight
                label="Coordonées"
                onChange={handleSelectCoordinates}
              />
            </CoordinatesInputWrapper>
          )}
          <ButtonRow $withTools={listener === InteractionListener.MISSION_ZONE}>
            {(listener === InteractionListener.MISSION_ZONE || listener === InteractionListener.REPORTING_ZONE) && (
              <IconGroup>
                <IconButton
                  active={interactionType === InteractionType.POLYGON}
                  appearance="primary"
                  icon={<PolygonIcon className="rs-icon" />}
                  onClick={handleSelectInteraction(InteractionType.POLYGON)}
                  size="md"
                />
                <IconButton
                  active={interactionType === InteractionType.SQUARE}
                  appearance="primary"
                  icon={<RectangleIcon className="rs-icon" />}
                  onClick={handleSelectInteraction(InteractionType.SQUARE)}
                  size="md"
                />
                <IconButton
                  active={interactionType === InteractionType.CIRCLE}
                  appearance="primary"
                  icon={<CircleIcon className="rs-icon" />}
                  onClick={handleSelectInteraction(InteractionType.CIRCLE)}
                  size="md"
                />
                <IconButton
                  active={interactionType === InteractionType.SELECTION}
                  appearance="primary"
                  icon={<SelectorIcon className="rs-icon" />}
                  size="md"
                />
              </IconGroup>
            )}
            <ButtonGroup>
              <ResetButton appearance="ghost" onClick={handleReset}>
                Réinitialiser
              </ResetButton>
              <ValidateButton disabled={!isGeometryValid} onClick={handleValidate}>
                Valider {listener && validateButtonPlaceholder[listener]}
              </ValidateButton>
            </ButtonGroup>
          </ButtonRow>
        </Body>
      </Panel>
    </Wrapper>
  )
}

const CoordinatesInputWrapper = styled.div`
  width: 280px;
  margin-right: auto !important;
  margin-left: auto;
  margin-bottom: 8px;
`

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  width: 580px;
  margin-left: calc(50% - 290px);
  margin-right: calc(50% - 290px);
`
const Panel = styled.div`
  box-shadow: 0px 3px 6px #00000029;
`

const Header = styled.h1`
  background: ${COLORS.charcoal};
  width: 580px;
  color: ${COLORS.white};
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  padding: 10px;
`
const IconGroup = styled.div`
  display: inline-block;
  & > :not(:last-child) {
    margin-right: 16px;
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

const ButtonGroup = styled.div`
  display: inline-block;
  & > :not(:last-child) {
    margin-right: 16px;
  }
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
const ButtonRow = styled.div<{ $withTools?: boolean }>`
  display: flex;
  justify-content: ${p => (p.$withTools ? 'space-between' : 'flex-end')};
`
const Body = styled.div`
  padding: 24px;

  background-color: ${COLORS.white};
`
