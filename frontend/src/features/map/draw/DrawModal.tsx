import { type Coordinates, CoordinatesInput, IconButton, Icon, usePrevious } from '@mtes-mct/monitor-ui'
import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import Point from 'ol/geom/Point'
import { transform } from 'ol/proj'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import {
  InteractionListener,
  InteractionType,
  OLGeometryType,
  OPENLAYERS_PROJECTION,
  WSG84_PROJECTION
} from '../../../domain/entities/map/constants'
import { setGeometry, setInteractionType } from '../../../domain/shared_slices/Draw'
import { setDisplayedItems, VisibilityState } from '../../../domain/shared_slices/Global'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { addFeatureToDrawedFeature } from '../../../domain/use_cases/draw/addFeatureToDrawedFeature'
import { eraseDrawedGeometries } from '../../../domain/use_cases/draw/eraseDrawedGeometries'
import {
  MapInteractionListenerEnum,
  updateMapInteractionListeners
} from '../../../domain/use_cases/map/updateMapInteractionListeners'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { getMissionPageRoute } from '../../../utils/routes'
import { MapInteraction } from '../../commonComponents/Modals/MapInteraction'

import type { MultiPoint, MultiPolygon } from 'ol/geom'

const titlePlaceholder = {
  CONTROL_POINT: 'un point de contrôle',
  MISSION_ZONE: 'une zone de mission',
  REPORTING_POINT: 'un point de signalement',
  REPORTING_ZONE: 'une zone de signalement',
  SURVEILLANCE_ZONE: 'une zone de surveillance',
  VIGILANCE_ZONE: 'une zone de vigilance'
}
const validateButtonPlaceholder = {
  CONTROL_POINT: 'le point de contrôle',
  MISSION_ZONE: 'la zone de mission',
  REPORTING_POINT: 'le point',
  REPORTING_ZONE: 'la zone',
  SURVEILLANCE_ZONE: 'la zone de surveillance',
  VIGILANCE_ZONE: 'la zone de vigilance'
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
      global.reportingFormVisibility.visibility === VisibilityState.NONE &&
      listener === InteractionListener.REPORTING_ZONE
    ) {
      dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
    }
  }, [dispatch, global.reportingFormVisibility, listener, sideWindow.status])

  const handleSelectInteraction = nextInteraction => () => {
    dispatch(setInteractionType(nextInteraction))
  }
  const handleCancel = () => {
    handleReset()

    // we add timeout to avoid the modal to close before the reset is done
    // and the geometry has been set in the form concerned
    setTimeout(() => {
      dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))
      if (listener === InteractionListener.VIGILANCE_ZONE) {
        dispatch(setDisplayedItems({ isLayersSidebarVisible: true }))
      }
    }, 300)
  }

  const handleReset = () => {
    if (!initialGeometry) {
      dispatch(eraseDrawedGeometries(initialFeatureNumberRef.current))

      return
    }

    dispatch(setGeometry(initialGeometry))
  }

  const handleValidate = () => {
    dispatch(updateMapInteractionListeners(MapInteractionListenerEnum.NONE))

    if (listener === InteractionListener.VIGILANCE_ZONE) {
      dispatch(setDisplayedItems({ isLayersSidebarVisible: true }))
    }
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
      const extent = nextFeature.getGeometry()?.getExtent()
      if (extent) {
        dispatch(setFitToExtent(extent))
      }
    },
    [dispatch]
  )

  const hasCustomTools = useMemo(
    () =>
      listener === InteractionListener.MISSION_ZONE ||
      listener === InteractionListener.REPORTING_ZONE ||
      listener === InteractionListener.SURVEILLANCE_ZONE ||
      listener === InteractionListener.VIGILANCE_ZONE,
    [listener]
  )
  if (!listener) {
    return null
  }

  return (
    <MapInteraction
      customTools={
        hasCustomTools && (
          <IconGroup>
            <IconButton
              className={interactionType === InteractionType.POLYGON ? '_active' : undefined}
              Icon={Icon.SelectPolygon}
              onClick={handleSelectInteraction(InteractionType.POLYGON)}
            />
            <IconButton
              className={interactionType === InteractionType.SQUARE ? '_active' : undefined}
              Icon={Icon.SelectRectangle}
              onClick={handleSelectInteraction(InteractionType.SQUARE)}
            />
            <IconButton
              className={interactionType === InteractionType.CIRCLE ? '_active' : undefined}
              Icon={Icon.SelectCircle}
              onClick={handleSelectInteraction(InteractionType.CIRCLE)}
            />
          </IconGroup>
        )
      }
      isValidatedButtonDisabled={!isGeometryValid}
      onCancel={handleCancel}
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
            name="coordinates"
            onChange={handleSelectCoordinates}
          />
        </CoordinatesInputWrapper>
      )}
    </MapInteraction>
  )
}

const CoordinatesInputWrapper = styled.div`
  margin-bottom: 8px;
  margin-left: auto;
  margin-right: auto !important;
  width: 280px;
`

const IconGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`
