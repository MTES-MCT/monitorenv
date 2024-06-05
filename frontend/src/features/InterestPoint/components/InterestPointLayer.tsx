import { editInterestPoint, removeInterestPoint, updateCurrentInterestPoint } from '@features/InterestPoint/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { OPENLAYERS_PROJECTION, usePrevious } from '@mtes-mct/monitor-ui'
import { InterestPointLine } from 'domain/entities/interestPointLine'
import { areCoordinatesModified, areFeatureCoordinatesModified } from 'domain/entities/interestPoints'
import { Layers } from 'domain/entities/layers/constants'
import { MapToolType } from 'domain/entities/map/constants'
import { globalActions } from 'domain/shared_slices/Global'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'
import { LineString, Point } from 'ol/geom'
import { Draw } from 'ol/interaction'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { getLength } from 'ol/sphere'
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'

import { InterestPointOverlay } from './InterestPointOverlay'
import { POIStyle, getInterestPointStyle, getLineStyle } from '../../map/layers/styles/interestPoint.style'
import { saveInterestPointFeature } from '../useCases/saveInterestPointFeature'
import { removeLine, removePoint, removeResidualElement } from '../utils'

import type { BaseMapChildrenProps } from '../../map/BaseMap'
import type { NewInterestPoint } from '@features/InterestPoint/types'
import type { Coordinate } from 'ol/coordinate'
import type { FeatureLike } from 'ol/Feature'
import type { DrawEvent } from 'ol/interaction/Draw'

const DRAW_START_EVENT = 'drawstart'
const DRAW_END_EVENT = 'drawend'

export const MIN_ZOOM = 7

export function InterestPointLayer({ map }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()
  const displayInterestPointLayer = useAppSelector(state => state.global.displayInterestPointLayer)

  const currentInterestPoint = useAppSelector(state => state.interestPoint.currentInterestPoint)

  const isDrawing = useAppSelector(state => state.interestPoint.isDrawing)
  const interestPoints = useAppSelector(state => state.interestPoint.interestPoints)

  const [drawObject, setDrawObject] = useState<Draw>()

  const [interestsPointsToCoordinate, setInterestsPointsToCoordinate] = useState(new Map())
  const previousInterestPoint = usePrevious<NewInterestPoint>(currentInterestPoint)

  const isMapToolVisible = useAppSelector(state => state.global.isMapToolVisible)

  const isOpen = useMemo(() => isMapToolVisible === MapToolType.INTEREST_POINT, [isMapToolVisible])

  // Clean residual interest point from layer when closing
  useEffect(() => {
    if (!isOpen) {
      removeResidualElement(currentInterestPoint.uuid, interestPoints, interestPointVectorSourceRef)
    }
  }, [currentInterestPoint.uuid, interestPoints, isOpen])

  const deleteInterestPoint = useCallback(
    (uuid: string) => {
      removePoint(uuid, interestPointVectorSourceRef)
      removeLine(uuid, interestPointVectorSourceRef)
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
      // FIXME (30/05/2024): find another solution to remove residual point
      removeResidualElement(currentInterestPoint.uuid, interestPoints, interestPointVectorSourceRef)

      dispatch(globalActions.hideSideButtons())
      dispatch(editInterestPoint(uuid))
      dispatch(globalActions.setIsMapToolVisible(MapToolType.INTEREST_POINT))
    },
    [currentInterestPoint.uuid, dispatch, interestPoints]
  )

  const interestPointVectorSourceRef = useRef(new VectorSource({ wrapX: false })) as MutableRefObject<
    VectorSource<Feature<LineString>>
  >
  const interestPointVectorLayer = useRef(
    new VectorLayer({
      renderBuffer: 7,
      source: interestPointVectorSourceRef.current,
      style: (feature, resolution) => (isFeatureIsALine(feature) ? getLineStyle() : getInterestPointStyle(resolution)),
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.INTEREST_POINT.zIndex
    })
  ) as MutableRefObject<VectorLayer<VectorSource>>

  useEffect(() => {
    const layer = interestPointVectorLayer.current
    map?.getLayers().push(layer)

    return () => {
      map?.removeLayer(layer)
    }
  }, [map])

  useEffect(() => {
    function drawExistingFeaturesOnMap() {
      if (map) {
        const features = interestPoints.reduce((feats, interestPoint) => {
          if (interestPoint.feature) {
            const nextFeature = new GeoJSON({
              featureProjection: OPENLAYERS_PROJECTION
            }).readFeature(interestPoint.feature)

            const { feature, ...interestPointWithoutFeature } = interestPoint
            nextFeature.setProperties(interestPointWithoutFeature)

            // TODO Check and remove this cast.
            feats.push(nextFeature as Feature<LineString>)

            return feats
          }

          return feats
        }, [] as Array<Feature<LineString>>)

        interestPointVectorSourceRef.current.addFeatures(features)
      }
    }

    drawExistingFeaturesOnMap()
  }, [map, interestPoints])

  useEffect(() => {
    function drawNewFeatureOnMap() {
      const draw = new Draw({
        source: interestPointVectorSourceRef.current,
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
        drawObject.once(DRAW_START_EVENT, event => {
          function startDrawing(e: DrawEvent) {
            const geometry = e.feature.getGeometry()
            if (geometry instanceof Point) {
              const coordinates = geometry.getCoordinates()
              dispatch(
                updateCurrentInterestPoint({
                  coordinates,
                  name: currentInterestPoint.name,
                  observations: currentInterestPoint.observations,
                  uuid: currentInterestPoint.uuid
                })
              )
            }
          }

          startDrawing(event)
        })

        drawObject.once(DRAW_END_EVENT, event => {
          dispatch(saveInterestPointFeature(event.feature))
        })
      }
    }

    handleDrawEvents()
  }, [dispatch, drawObject, currentInterestPoint])

  useEffect(() => {
    function modifyFeatureWhenCoordinatesAreModified() {
      if (currentInterestPoint.coordinates?.length) {
        const drawingFeatureToUpdate = interestPointVectorSourceRef.current.getFeatureById(currentInterestPoint.uuid)

        if (drawingFeatureToUpdate && areFeatureCoordinatesModified(drawingFeatureToUpdate, currentInterestPoint)) {
          const { feature, ...interestPointWithoutFeature } = currentInterestPoint

          const geometry = drawingFeatureToUpdate.getGeometry()
          if (interestPointWithoutFeature.coordinates) {
            // FIXME [17/05/2024] typage à refacto: Openlayer fonctionne avec Coordinate[] et Coordinate
            geometry?.setCoordinates(interestPointWithoutFeature.coordinates as unknown as Coordinate[])
          }
          drawingFeatureToUpdate.setProperties(interestPointWithoutFeature)

          const nextFeature = new GeoJSON().writeFeatureObject(drawingFeatureToUpdate, {
            featureProjection: OPENLAYERS_PROJECTION
          })

          const { feature: currentFeature, ...currentInterestPointWithoutFeature } = currentInterestPoint

          dispatch(updateCurrentInterestPoint({ feature: nextFeature, ...currentInterestPointWithoutFeature }))
        }
      }
    }

    modifyFeatureWhenCoordinatesAreModified()
  }, [currentInterestPoint, dispatch])

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
            const feature = interestPointVectorSourceRef.current.getFeatureById(featureId)
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
    interestPointVectorLayer.current.setVisible(displayInterestPointLayer)
  }, [displayInterestPointLayer])

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
          modifyInterestPoint={() => {}}
          moveLine={moveInterestPointLine}
        />
      )}
    </div>
  )

  function isFeatureIsALine(feature: FeatureLike) {
    return feature?.getId()?.toString()?.includes('line')
  }

  function addLineToFeature(coordinates: Coordinate, nextCoordinates: Coordinate, featureId: string) {
    const interestPointLineFeature = InterestPointLine.getFeature(coordinates, nextCoordinates, featureId)

    interestPointVectorSourceRef.current.addFeature(interestPointLineFeature)
  }

  function updateLineFromExistingFeature(featureId: string, uuid: string | number, nextCoordinates: Coordinate) {
    const existingLabelLineFeature = interestPointVectorSourceRef.current.getFeatureById(featureId)
    const interestPointFeature = interestPointVectorSourceRef.current.getFeatureById(uuid)

    if (existingLabelLineFeature) {
      const geometry = interestPointFeature?.getGeometry()
      if (geometry) {
        existingLabelLineFeature.setGeometry(new LineString([nextCoordinates, geometry.getFlatCoordinates()]))
      }
    }
  }
}
