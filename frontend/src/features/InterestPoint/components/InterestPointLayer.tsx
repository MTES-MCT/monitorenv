import { editInterestPoint, removeInterestPoint } from '@features/InterestPoint/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { OPENLAYERS_PROJECTION, usePrevious } from '@mtes-mct/monitor-ui'
import { useMapContext } from 'context/map/MapContext'
import { InterestPointLine } from 'domain/entities/interestPointLine'
import { areCoordinatesModified } from 'domain/entities/interestPoints'
import { Layers } from 'domain/entities/layers/constants'
import { MapToolType } from 'domain/entities/map/constants'
import { globalActions } from 'domain/shared_slices/Global'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'
import { LineString } from 'ol/geom'
import { Draw } from 'ol/interaction'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { getLength } from 'ol/sphere'
import { memo, useCallback, useEffect, useRef, useState } from 'react'

import { InterestPointOverlay } from './InterestPointOverlay'
import { POIStyle, getInterestPointStyle, getLineStyle } from '../../map/layers/styles/interestPoint.style'
import { modifyFeatureWhenCoordinatesAreModifiedAction } from '../useCases/layer/modifyFeatureWhenCoordinatesAreModified'
import { startDrawingAction } from '../useCases/layer/startDrawing'
import { saveInterestPointFeature } from '../useCases/saveInterestPointFeature'

import type { NewInterestPoint } from '@features/InterestPoint/types'
import type { Coordinate } from 'ol/coordinate'
import type { FeatureLike } from 'ol/Feature'

const DRAW_END_EVENT = 'drawend'

export const MIN_ZOOM = 7

export const InterestPointLayer = memo(() => {
  const { map } = useMapContext()

  const dispatch = useAppDispatch()
  const displayInterestPointLayer = useAppSelector(state => state.global.layers.displayInterestPointLayer)

  const currentInterestPoint = useAppSelector(state => state.interestPoint.currentInterestPoint)

  const isDrawing = useAppSelector(state => state.interestPoint.isDrawing)
  const interestPoints = useAppSelector(state => state.interestPoint.interestPoints)

  const [drawObject, setDrawObject] = useState<Draw>()

  const [interestsPointsToCoordinate, setInterestsPointsToCoordinate] = useState(new Map())
  const previousInterestPoint = usePrevious<NewInterestPoint>(currentInterestPoint)

  const deleteInterestPoint = useCallback(
    (uuid: string) => {
      dispatch(removeInterestPoint(uuid))
      dispatch(globalActions.setIsMapToolVisible(undefined))
    },
    [dispatch]
  )

  const moveInterestPointLine = useCallback(
    (uuid: string | number, coordinates: Coordinate, nextCoordinates: Coordinate, offset: any) => {
      const featureId = InterestPointLine.getFeatureId(uuid)

      if (interestsPointsToCoordinate.has(featureId)) {
        updateLineFromExistingFeature(featureId, uuid, nextCoordinates)
      } else {
        addLineToFeature(coordinates, nextCoordinates, featureId)
      }

      const nextFeatureToCoordinates = interestsPointsToCoordinate
      interestsPointsToCoordinate.set(featureId, { coordinates: nextCoordinates, offset })
      setInterestsPointsToCoordinate(nextFeatureToCoordinates)
    },
    [interestsPointsToCoordinate]
  )

  const modifyInterestPoint = useCallback(
    (uuid: string) => {
      dispatch(globalActions.hideAllDialogs())
      dispatch(editInterestPoint(uuid))
      dispatch(globalActions.setIsMapToolVisible(MapToolType.INTEREST_POINT))
    },
    [dispatch]
  )

  const openEdition = useCallback(() => {
    dispatch(globalActions.hideAllDialogs())
    dispatch(globalActions.setIsMapToolVisible(MapToolType.INTEREST_POINT))
  }, [dispatch])

  // TODO(07/11/24): re-add typing
  const vectorSourceRef = useRef(new VectorSource({ wrapX: false }))
  const vectorLayer = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: vectorSourceRef.current,
      style: (feature, resolution) => (isFeatureIsALine(feature) ? getLineStyle() : getInterestPointStyle(resolution)),
      zIndex: Layers.INTEREST_POINT.zIndex
    })
  )

  useEffect(() => {
    const layer = vectorLayer.current
    map?.getLayers().push(layer)

    return () => {
      map?.removeLayer(layer)
    }
  }, [map])

  useEffect(() => {
    function drawExistingFeaturesOnMap() {
      if (map) {
        const features = interestPoints
          .filter(item => item.uuid !== currentInterestPoint.uuid)
          .reduce((feats, interestPoint) => {
            if (interestPoint.feature) {
              const nextFeature = new GeoJSON({
                featureProjection: OPENLAYERS_PROJECTION
              }).readFeature(interestPoint.feature) as Feature<LineString>

              const { feature, ...interestPointWithoutFeature } = interestPoint
              nextFeature.setProperties(interestPointWithoutFeature)

              feats.push(nextFeature)

              return feats
            }

            return feats
          }, [] as Array<Feature<LineString>>)
        const { feature: currentFeature, ...currentInterestPointWithoutFeature } = currentInterestPoint

        if (currentFeature) {
          const currentFeatureToDraw = new GeoJSON({
            featureProjection: OPENLAYERS_PROJECTION
          }).readFeature(currentInterestPoint.feature) as Feature<LineString>
          currentFeatureToDraw.setProperties(currentInterestPointWithoutFeature)

          features.push(currentFeatureToDraw)
        }
        vectorSourceRef.current.clear()
        vectorSourceRef.current.addFeatures(features)
      }
    }

    drawExistingFeaturesOnMap()
  }, [map, interestPoints, currentInterestPoint])

  useEffect(() => {
    function drawNewFeatureOnMap() {
      const draw = new Draw({
        source: vectorSourceRef.current,
        stopClick: true,
        style: POIStyle,
        type: 'Point'
      })
      map?.addInteraction(draw)
      setDrawObject(draw)
    }
    if (map && isDrawing) {
      drawNewFeatureOnMap()
    }
  }, [map, isDrawing])

  useEffect(() => {
    function quitInteraction() {
      if (map && drawObject) {
        map.removeInteraction(drawObject)
      }
    }

    if (!isDrawing && drawObject) {
      setDrawObject(undefined)
      quitInteraction()
    }
  }, [map, drawObject, isDrawing])

  useEffect(() => {
    function handleDrawEvents() {
      if (drawObject) {
        dispatch(startDrawingAction(drawObject))

        drawObject.once(DRAW_END_EVENT, event => {
          dispatch(saveInterestPointFeature(event.feature))
        })
      }
    }

    handleDrawEvents()
  }, [currentInterestPoint, dispatch, drawObject])

  useEffect(() => {
    dispatch(modifyFeatureWhenCoordinatesAreModifiedAction(vectorSourceRef))
  }, [dispatch])

  useEffect(() => {
    function initLineWhenInterestPointCoordinatesModified() {
      if (
        previousInterestPoint &&
        areCoordinatesModified(currentInterestPoint, previousInterestPoint) &&
        currentInterestPoint.coordinates &&
        previousInterestPoint.coordinates
      ) {
        const line = new LineString([currentInterestPoint.coordinates, previousInterestPoint.coordinates])
        const distance = getLength(line, { projection: OPENLAYERS_PROJECTION })

        if (distance > 10) {
          const featureId = InterestPointLine.getFeatureId(currentInterestPoint.uuid)
          if (interestsPointsToCoordinate.has(featureId)) {
            interestsPointsToCoordinate.delete(featureId)
            const feature = vectorSourceRef.current.getFeatureById(featureId)
            if (feature && !!currentInterestPoint.coordinates) {
              feature.setGeometry(new LineString([currentInterestPoint.coordinates, currentInterestPoint.coordinates]))
            }
          }
        }
      }
    }

    initLineWhenInterestPointCoordinatesModified()
  }, [currentInterestPoint, interestsPointsToCoordinate, previousInterestPoint])

  useEffect(() => {
    vectorLayer.current.setVisible(displayInterestPointLayer)
  }, [displayInterestPointLayer])

  function isFeatureIsALine(feature: FeatureLike) {
    return feature?.getId()?.toString()?.includes('line')
  }

  function addLineToFeature(coordinates: Coordinate, nextCoordinates: Coordinate, featureId: string) {
    const interestPointLineFeature = InterestPointLine.getFeature(coordinates, nextCoordinates, featureId)

    vectorSourceRef.current.addFeature(interestPointLineFeature)
  }

  function updateLineFromExistingFeature(featureId: string, uuid: string | number, nextCoordinates: Coordinate) {
    const existingLabelLineFeature = vectorSourceRef.current.getFeatureById(featureId)
    const interestPointFeature = vectorSourceRef.current.getFeatureById(uuid)

    if (existingLabelLineFeature) {
      const geometry = interestPointFeature?.getGeometry() as LineString
      if (geometry) {
        existingLabelLineFeature.setGeometry(new LineString([nextCoordinates, geometry.getFlatCoordinates()]))
      }
    }
  }

  return (
    <div>
      {interestPoints
        .filter(item => item.uuid !== currentInterestPoint.uuid)
        .map(interestPoint => (
          <InterestPointOverlay
            key={interestPoint.uuid}
            deleteInterestPoint={deleteInterestPoint}
            interestPoint={interestPoint}
            isVisible={displayInterestPointLayer}
            map={map}
            modifyInterestPoint={modifyInterestPoint}
            moveLine={moveInterestPointLine}
          />
        ))}
      {currentInterestPoint.coordinates && (
        <InterestPointOverlay
          deleteInterestPoint={deleteInterestPoint}
          interestPoint={currentInterestPoint}
          isVisible={displayInterestPointLayer}
          map={map}
          modifyInterestPoint={openEdition}
          moveLine={moveInterestPointLine}
        />
      )}
    </div>
  )
})
