import GeoJSON from 'ol/format/GeoJSON'
import LineString from 'ol/geom/LineString'
import Draw from 'ol/interaction/Draw'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { getLength } from 'ol/sphere'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

import { InterestPointLine } from '../../../domain/entities/interestPointLine'
import {
  coordinatesAreModified,
  coordinatesOrTypeAreModified,
  interestPointType
} from '../../../domain/entities/interestPoints'
import Layers from '../../../domain/entities/layers'
import { OPENLAYERS_PROJECTION } from '../../../domain/entities/map'
import {
  deleteInterestPointBeingDrawed,
  editInterestPoint,
  endInterestPointDraw,
  removeInterestPoint,
  resetInterestPointFeatureDeletion,
  updateInterestPointBeingDrawed,
  updateInterestPointKeyBeingDrawed
} from '../../../domain/shared_slices/InterestPoint'
import saveInterestPointFeature from '../../../domain/use_cases/interestPoint/saveInterestPointFeature'
import { usePrevious } from '../../../hooks/usePrevious'
import InterestPointOverlay from '../overlays/InterestPointOverlay'
import { getInterestPointStyle, POIStyle } from './styles/interestPoint.style'

const DRAW_START_EVENT = 'drawstart'
const DRAW_ABORT_EVENT = 'drawabort'
const DRAW_END_EVENT = 'drawend'

export const MIN_ZOOM = 7

function InterestPointLayer({ map }) {
  const dispatch = useDispatch()

  const {
    interestPointBeingDrawed,
    interestPoints,
    /** @type {InterestPoint | null} interestPointBeingDrawed */
    isDrawing,
    /** @type {InterestPoint[]} interestPoints */
    isEditing,
    triggerInterestPointFeatureDeletion
  } = useSelector(state => state.interestPoint)

  const [drawObject, setDrawObject] = useState(null)
  const vectorSourceRef = useRef(null)
  const GetVectorSource = () => {
    if (vectorSourceRef.current === null) {
      vectorSourceRef.current = new VectorSource({ projection: OPENLAYERS_PROJECTION, wrapX: false })
    }

    return vectorSourceRef.current
  }

  const [interestPointToCoordinates, setInterestPointToCoordinates] = useState(new Map())
  const previousInterestPointBeingDrawed = usePrevious(interestPointBeingDrawed)

  useEffect(() => {
    const interestPointVectorLayer = new VectorLayer({
      renderBuffer: 7,
      source: GetVectorSource(),
      style: (feature, resolution) => getInterestPointStyle(feature, resolution),
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      zIndex: Layers.INTEREST_POINT.zIndex
    })
    map?.getLayers().push(interestPointVectorLayer)

    return () => {
      map?.removeLayer(interestPointVectorLayer)
    }
  }, [map])

  useEffect(() => {
    function drawExistingFeaturesOnMap() {
      if (interestPoints && map) {
        const features = interestPoints.map(interestPoint => {
          if (interestPoint.feature) {
            const nextFeature = new GeoJSON({
              featureProjection: OPENLAYERS_PROJECTION
            }).readFeature(interestPoint.feature)

            const { feature, ...interestPointWithoutFeature } = interestPoint
            nextFeature.setProperties(interestPointWithoutFeature)

            return nextFeature
          }

          return null
        })

        GetVectorSource().addFeatures(features)
      }
    }

    drawExistingFeaturesOnMap()
  }, [map, interestPoints])

  useEffect(() => {
    if (map && isDrawing) {
      function addEmptyNextInterestPoint() {
        dispatch(
          updateInterestPointBeingDrawed({
            coordinates: null,
            name: null,
            observations: null,
            type: null,
            uuid: uuidv4()
          })
        )
      }

      function drawNewFeatureOnMap() {
        const draw = new Draw({
          source: GetVectorSource(),
          style: POIStyle,
          type: 'Point'
        })

        map.addInteraction(draw)
        setDrawObject(draw)
      }

      addEmptyNextInterestPoint()
      drawNewFeatureOnMap()
    }
  }, [map, isDrawing])

  useEffect(() => {
    function removeInteraction() {
      if (!isDrawing && drawObject) {
        setDrawObject(null)

        function waitForUnwantedZoomAndQuitInteraction() {
          setTimeout(() => {
            map.removeInteraction(drawObject)
          }, 300)
        }

        waitForUnwantedZoomAndQuitInteraction()
      }
    }

    removeInteraction()
  }, [isDrawing])

  useEffect(() => {
    function handleDrawEvents() {
      if (drawObject) {
        drawObject.once(DRAW_START_EVENT, event => {
          function startDrawing(event, type) {
            dispatch(
              updateInterestPointBeingDrawed({
                coordinates: event.feature.getGeometry().getLastCoordinate(),
                name: null,
                observations: null,
                type,
                uuid: interestPointBeingDrawed.uuid
              })
            )
          }

          startDrawing(event, interestPointBeingDrawed.type || interestPointType.FISHING_VESSEL)
        })

        drawObject.once(DRAW_ABORT_EVENT, () => {
          dispatch(endInterestPointDraw())
          dispatch(deleteInterestPointBeingDrawed())
        })

        drawObject.once(DRAW_END_EVENT, event => {
          dispatch(saveInterestPointFeature(event.feature))
          dispatch(endInterestPointDraw())
        })
      }
    }

    handleDrawEvents()
  }, [drawObject, interestPointBeingDrawed])

  useEffect(() => {
    if (triggerInterestPointFeatureDeletion) {
      deleteInterestPoint(triggerInterestPointFeatureDeletion)
      resetInterestPointFeatureDeletion()
    }
  }, [triggerInterestPointFeatureDeletion])

  useEffect(() => {
    function modifyFeatureWhenCoordinatesOrTypeModified() {
      if (interestPointBeingDrawed?.coordinates?.length && interestPointBeingDrawed?.uuid) {
        const drawingFeatureToUpdate = GetVectorSource().getFeatureById(interestPointBeingDrawed.uuid)

        if (drawingFeatureToUpdate && coordinatesOrTypeAreModified(drawingFeatureToUpdate, interestPointBeingDrawed)) {
          const { feature, ...interestPointWithoutFeature } = interestPointBeingDrawed
          drawingFeatureToUpdate.getGeometry().setCoordinates(interestPointWithoutFeature.coordinates)
          drawingFeatureToUpdate.setProperties(interestPointWithoutFeature)

          const nextFeature = new GeoJSON().writeFeatureObject(drawingFeatureToUpdate, {
            featureProjection: OPENLAYERS_PROJECTION
          })

          dispatch(
            updateInterestPointKeyBeingDrawed({
              key: 'feature',
              value: nextFeature
            })
          )
        }
      }
    }

    modifyFeatureWhenCoordinatesOrTypeModified()
  }, [interestPointBeingDrawed])

  useEffect(() => {
    function initLineWhenInterestPointCoordinatesModified() {
      if (
        interestPointBeingDrawed &&
        previousInterestPointBeingDrawed &&
        coordinatesAreModified(interestPointBeingDrawed, previousInterestPointBeingDrawed)
      ) {
        const line = new LineString([
          interestPointBeingDrawed.coordinates,
          previousInterestPointBeingDrawed.coordinates
        ])
        const distance = getLength(line, { projection: OPENLAYERS_PROJECTION })

        if (distance > 10) {
          const featureId = InterestPointLine.getFeatureId(interestPointBeingDrawed.uuid)
          if (interestPointToCoordinates.has(featureId)) {
            interestPointToCoordinates.delete(featureId)
            const feature = GetVectorSource().getFeatureById(featureId)
            if (feature) {
              feature.setGeometry(
                new LineString([interestPointBeingDrawed.coordinates, interestPointBeingDrawed.coordinates])
              )
            }
          }
        }
      }
    }

    initLineWhenInterestPointCoordinatesModified()
  }, [interestPointBeingDrawed])

  function deleteInterestPoint(uuid) {
    const feature = GetVectorSource().getFeatureById(uuid)
    if (feature) {
      GetVectorSource().removeFeature(feature)
      GetVectorSource().changed()
    }

    const featureLine = GetVectorSource().getFeatureById(InterestPointLine.getFeatureId(uuid))
    if (featureLine) {
      GetVectorSource().removeFeature(featureLine)
      GetVectorSource().changed()
    }

    dispatch(removeInterestPoint(uuid))
  }

  function moveInterestPointLine(uuid, coordinates, nextCoordinates, offset) {
    const featureId = InterestPointLine.getFeatureId(uuid)

    if (interestPointToCoordinates.has(featureId)) {
      const existingLabelLineFeature = GetVectorSource().getFeatureById(featureId)
      const interestPointFeature = GetVectorSource().getFeatureById(uuid)

      if (existingLabelLineFeature) {
        if (interestPointFeature) {
          existingLabelLineFeature.setGeometry(
            new LineString([interestPointFeature.getGeometry().getCoordinates(), nextCoordinates])
          )
        }
      }
    } else {
      const interestPointLineFeature = InterestPointLine.getFeature(coordinates, nextCoordinates, featureId)

      GetVectorSource().addFeature(interestPointLineFeature)
    }

    const nextVesselToCoordinates = interestPointToCoordinates
    interestPointToCoordinates.set(featureId, { coordinates: nextCoordinates, offset })
    setInterestPointToCoordinates(nextVesselToCoordinates)
  }

  function modifyInterestPoint(uuid) {
    dispatch(editInterestPoint(uuid))
  }

  return (
    <div>
      {interestPoints && Array.isArray(interestPoints)
        ? interestPoints.map(interestPoint => (
            <InterestPointOverlay
              key={interestPoint.uuid}
              coordinates={interestPoint.coordinates}
              deleteInterestPoint={deleteInterestPoint}
              featureIsShowed
              map={map}
              modifyInterestPoint={modifyInterestPoint}
              moveLine={moveInterestPointLine}
              name={interestPoint.name}
              observations={interestPoint.observations}
              uuid={interestPoint.uuid}
            />
          ))
        : null}
      {interestPointBeingDrawed && !isEditing ? (
        <InterestPointOverlay
          coordinates={interestPointBeingDrawed.coordinates}
          deleteInterestPoint={() => dispatch(endInterestPointDraw()) && dispatch(deleteInterestPointBeingDrawed())}
          featureIsShowed={drawObject}
          map={map}
          modifyInterestPoint={() => {}}
          moveLine={moveInterestPointLine}
          name={interestPointBeingDrawed.name}
          observations={interestPointBeingDrawed.observations}
          uuid={interestPointBeingDrawed.uuid}
        />
      ) : null}
    </div>
  )
}

export default InterestPointLayer
