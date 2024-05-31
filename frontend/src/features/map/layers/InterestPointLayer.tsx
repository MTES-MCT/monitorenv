import { usePrevious } from '@mtes-mct/monitor-ui'
import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'
import Draw, { DrawEvent } from 'ol/interaction/Draw'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { getLength } from 'ol/sphere'
import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react'

import { POIStyle, getInterestPointStyle, getLineStyle } from './styles/interestPoint.style'
import { InterestPointLine } from '../../../domain/entities/interestPointLine'
import { coordinatesAreModified, coordinatesOrTypeAreModified } from '../../../domain/entities/interestPoints'
import { Layers } from '../../../domain/entities/layers/constants'
import { MapToolType, OPENLAYERS_PROJECTION } from '../../../domain/entities/map/constants'
import { globalActions } from '../../../domain/shared_slices/Global'
import {
  editInterestPoint,
  endDrawingInterestPoint,
  removeCurrentInterestPoint,
  removeInterestPoint,
  updateCurrentInterestPoint,
  updateCurrentInterestPointProperty
} from '../../../domain/shared_slices/InterestPoint'
import { saveInterestPointFeature } from '../../../domain/use_cases/interestPoint/saveInterestPointFeature'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { InterestPointOverlay } from '../overlays/InterestPointOverlay'

import type { NewInterestPoint } from '../../InterestPoint/types'
import type { BaseMapChildrenProps } from '../BaseMap'
import type { Coordinate } from 'ol/coordinate'

const DRAW_START_EVENT = 'drawstart'
const DRAW_ABORT_EVENT = 'drawabort'
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

  const deleteInterestPoint = useCallback(
    (uuid: string) => {
      removePoint(uuid)
      removeLine(uuid)
      dispatch(removeInterestPoint(uuid))
      dispatch(globalActions.setIsMapToolVisible(undefined))
    },
    [dispatch]
  )

  const deleteCurrentInterestPoint = useCallback(
    (uuid: string) => {
      removePoint(uuid)
      removeLine(uuid)
      dispatch(removeCurrentInterestPoint())
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
      dispatch(globalActions.hideSideButtons())
      dispatch(editInterestPoint(uuid))
      dispatch(globalActions.setIsMapToolVisible(MapToolType.INTEREST_POINT))
    },
    [dispatch]
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
    map?.getLayers().push(interestPointVectorLayer.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      map?.removeLayer(interestPointVectorLayer.current)
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
    function waitForUnwantedZoomAndQuitInteraction() {
      setTimeout(() => {
        if (map && drawObject) {
          map.removeInteraction(drawObject)
        }
      }, 300)
    }
    if (!isDrawing && drawObject) {
      setDrawObject(undefined)

      waitForUnwantedZoomAndQuitInteraction()
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
                  name: null,
                  observations: null,
                  uuid: currentInterestPoint.uuid
                })
              )
            }
          }

          startDrawing(event)
        })

        drawObject.once(DRAW_ABORT_EVENT, () => {
          dispatch(endDrawingInterestPoint())
        })

        drawObject.once(DRAW_END_EVENT, event => {
          dispatch(saveInterestPointFeature(event.feature))
        })
      }
    }

    handleDrawEvents()
  }, [dispatch, drawObject, currentInterestPoint])

  useEffect(() => {
    function modifyFeatureWhenCoordinatesOrTypeModified() {
      if (currentInterestPoint.coordinates?.length && currentInterestPoint.uuid) {
        const drawingFeatureToUpdate = interestPointVectorSourceRef.current.getFeatureById(currentInterestPoint.uuid)

        if (drawingFeatureToUpdate && coordinatesOrTypeAreModified(drawingFeatureToUpdate, currentInterestPoint)) {
          const { feature, ...interestPointWithoutFeature } = currentInterestPoint
          const geometry = drawingFeatureToUpdate.getGeometry()
          if (interestPointWithoutFeature.coordinates) {
            // TODO [17/05/2024] typage à refacto: Openlayer fonctionne avec Coordinate[] et Coordinate
            geometry?.setCoordinates(interestPointWithoutFeature.coordinates as unknown as Coordinate[])
          }
          drawingFeatureToUpdate.setProperties(interestPointWithoutFeature)

          const nextFeature = new GeoJSON().writeFeatureObject(drawingFeatureToUpdate, {
            featureProjection: OPENLAYERS_PROJECTION
          })

          dispatch(
            updateCurrentInterestPointProperty({
              key: 'feature',
              value: nextFeature
            })
          )
        }
      }
    }

    modifyFeatureWhenCoordinatesOrTypeModified()
  }, [dispatch, currentInterestPoint])

  useEffect(() => {
    function initLineWhenInterestPointCoordinatesModified() {
      if (
        previousInterestPoint &&
        coordinatesAreModified(currentInterestPoint, previousInterestPoint) &&
        !!currentInterestPoint.coordinates &&
        !!previousInterestPoint.coordinates
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
      {interestPoints.map(interestPoint => (
        <InterestPointOverlay
          key={interestPoint.uuid}
          deleteInterestPoint={deleteInterestPoint}
          interestPoint={interestPoint}
          isVisible={displayInterestPointLayer}
          map={map}
          modifyInterestPoint={uuid => {
            modifyInterestPoint(uuid)
          }}
          moveLine={moveInterestPointLine}
        />
      ))}
      {!isPersisted(currentInterestPoint.uuid) ? (
        <InterestPointOverlay
          deleteInterestPoint={deleteCurrentInterestPoint}
          interestPoint={currentInterestPoint}
          isVisible={displayInterestPointLayer}
          map={map}
          modifyInterestPoint={() => {}}
          moveLine={moveInterestPointLine}
        />
      ) : null}
    </div>
  )

  function isPersisted(uuid: string) {
    return interestPoints.find(interestPoint => interestPoint.uuid === uuid)
  }

  function isFeatureIsALine(feature) {
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

  function removeLine(uuid: string) {
    const featureLine = interestPointVectorSourceRef.current.getFeatureById(InterestPointLine.getFeatureId(uuid))
    if (featureLine) {
      interestPointVectorSourceRef.current.removeFeature(featureLine)
      interestPointVectorSourceRef.current.changed()
    }
  }

  function removePoint(uuid: string) {
    const feature = interestPointVectorSourceRef.current.getFeatureById(uuid)

    if (feature) {
      interestPointVectorSourceRef.current.removeFeature(feature)
      interestPointVectorSourceRef.current.changed()
    }
  }
}
