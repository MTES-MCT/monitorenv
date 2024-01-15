import { type Coordinates, CoordinatesInput } from '@mtes-mct/monitor-ui'
import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import Point from 'ol/geom/Point'
import { transform } from 'ol/proj'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import {
  InteractionListener,
  InteractionType,
  OLGeometryType,
  OPENLAYERS_PROJECTION,
  WSG84_PROJECTION
} from '../../../domain/entities/map/constants'
import { setGeometry, setInteractionType } from '../../../domain/shared_slices/Draw'
import { VisibilityState } from '../../../domain/shared_slices/Global'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { addFeatureToDrawedFeature } from '../../../domain/use_cases/draw/addFeatureToDrawedFeature'
import { eraseDrawedGeometries } from '../../../domain/use_cases/draw/eraseDrawedGeometries'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from '../../../domain/use_cases/map/updateMapInteractionListeners'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { usePrevious } from '../../../hooks/usePrevious'
import { ReactComponent as CircleSVG } from '../../../uiMonitor/icons/Info.svg'
import { ReactComponent as PolygonSVG } from '../../../uiMonitor/icons/Polygone.svg'
import { ReactComponent as RectangleSVG } from '../../../uiMonitor/icons/Rectangle.svg'
import { ReactComponent as SelectorSVG } from '../../../uiMonitor/icons/Selector.svg'
import { getMissionPageRoute } from '../../../utils/routes'
import { MapInteraction } from '../../commonComponents/Modals/MapInteraction'
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

  const geometry = useAppSelector(state => state.draw.geometry)
  const initialGeometry = useAppSelector(state => state.draw.initialGeometry)
  const interactionType = useAppSelector(state => state.draw.interactionType)
  const isGeometryValid = useAppSelector(state => state.draw.isGeometryValid)
  const listener = useAppSelector(state => state.draw.listener)

  const global = useAppSelector(state => state.global)
  const coordinatesFormat = useAppSelector(state => state.map?.coordinatesFormat)
  const sideWindow = useAppSelector(state => state.sideWindow)

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

  // Close modal when selected mission form is hidden
  useEffect(() => {
    if (
      previousMissionId &&
      previousMissionId !== routeParams?.params?.id &&
      (listener === InteractionListener.MISSION_ZONE ||
        listener === InteractionListener.CONTROL_POINT ||
        listener === InteractionListener.SURVEILLANCE_ZONE)
    ) {
      dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
    }
  }, [listener, dispatch, previousMissionId, routeParams])

  // Close DrawModal when closing reporting form
  useEffect(() => {
    if (
      sideWindow.status === SideWindowStatus.CLOSED &&
      global.reportingFormVisibility.visibility === VisibilityState.NONE
    ) {
      dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
    }
  }, [dispatch, global.reportingFormVisibility, sideWindow.status])

  const handleSelectInteraction = nextInteraction => () => {
    dispatch(setInteractionType(nextInteraction))
  }
  const handleReset = () => {
    if (!initialGeometry) {
      return dispatch(eraseDrawedGeometries(initialFeatureNumberRef.current))
    }

    return dispatch(setGeometry(initialGeometry))
  }
  const handleValidate = () => {
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
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
  if (!listener) {
    return null
  }

  return (
    <MapInteraction
      customTools={
        (listener === InteractionListener.MISSION_ZONE || listener === InteractionListener.REPORTING_ZONE) && (
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
        )
      }
      isValidatedButtonDisabled={!isGeometryValid}
      onReset={handleReset}
      onValidate={handleValidate}
      title={`Vous êtes en train d'ajouter ${listener && titlePlaceholder[listener]}`}
      validateButtonText={`Valider ${listener && validateButtonPlaceholder[listener]}`}
    >
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
    </MapInteraction>
  )
}

const CoordinatesInputWrapper = styled.div`
  width: 280px;
  margin-right: auto !important;
  margin-left: auto;
  margin-bottom: 8px;
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
