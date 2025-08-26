import { getFeature } from '@utils/getFeature'
import { getCenter } from 'ol/extent'
import Feature from 'ol/Feature'
import Circle from 'ol/geom/Circle'
import LineString from 'ol/geom/LineString'
import { fromCircle } from 'ol/geom/Polygon'
import Draw from 'ol/interaction/Draw'
import VectorLayer from 'ol/layer/Vector'
import { unByKey } from 'ol/Observable'
import VectorSource from 'ol/source/Vector'
import { getLength } from 'ol/sphere'
import React, { useCallback, useEffect, useRef } from 'react'

import { measurementStyle, measurementStyleWithCenter } from './styles/measurement.style'
import { Layers } from '../../../domain/entities/layers/constants'
import { DistanceUnit } from '../../../domain/entities/map/constants'
import {
  removeMeasurementDrawed,
  resetMeasurementTypeToAdd,
  setCustomCircleMesurement
} from '../../../domain/shared_slices/Measurement'
import { saveMeasurement } from '../../../domain/use_cases/measurement/saveMeasurement'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { getNauticalMilesFromMeters } from '../../../utils/utils'
import { MeasurementOverlay } from '../overlays/MeasurementOverlay'

import type { BaseMapChildrenProps } from '../BaseMap'
import type { Measurement } from '@features/map/layers/measurement'
import type { Coordinate } from 'ol/coordinate'
import type { EventsKey } from 'ol/events'
import type { Geometry } from 'ol/geom'

const DRAW_START_EVENT = 'drawstart'
const DRAW_ABORT_EVENT = 'drawabort'
const DRAW_END_EVENT = 'drawend'

const getNauticalMilesRadiusOfCircle = (circle: Circle, distanceUnit: DistanceUnit) => {
  const polygon = fromCircle(circle)

  return getNauticalMilesRadiusOfCircularPolygon(polygon, distanceUnit)
}

const getNauticalMilesOfLine = (line: LineString, distanceUnit: DistanceUnit) => {
  const length = getLength(line)

  if (distanceUnit === DistanceUnit.METRIC) {
    return Math.round(length)
  }

  return getNauticalMilesFromMeters(length)
}

function getNauticalMilesRadiusOfCircularPolygon(polygon: Geometry, distanceUnit: DistanceUnit) {
  const length = getLength(polygon)
  const radius = length / (2 * Math.PI)

  if (distanceUnit === DistanceUnit.METRIC) {
    return Math.round(radius)
  }

  return getNauticalMilesFromMeters(radius)
}

export function MeasurementLayer({ map }: BaseMapChildrenProps) {
  const dispatch = useAppDispatch()

  const distanceUnit = useAppSelector(state => state.map.distanceUnit)

  const { measurementsDrawed, measurementTypeToAdd } = useAppSelector(state => state.measurement)
  const measurementInProgressRef = useRef<Measurement>()
  const setMeasurementInProgress = value => {
    measurementInProgressRef.current = value
  }
  const currentInteraction = useRef<Draw>()
  const vectorSourceRef = useRef() as React.MutableRefObject<VectorSource<Feature<Geometry>>>
  const GetVectorSource = () => {
    if (vectorSourceRef.current === undefined) {
      vectorSourceRef.current = new VectorSource({ wrapX: false })
    }

    return vectorSourceRef.current
  }

  useEffect(() => {
    if (map) {
      const vectorLayer = new VectorLayer({
        className: Layers.MEASUREMENT.code,
        renderBuffer: 7,
        source: GetVectorSource(),
        style: [measurementStyle(), measurementStyleWithCenter],
        zIndex: Layers.MEASUREMENT.zIndex
      })
      map.getLayers().push(vectorLayer)

      return () => {
        if (map) {
          map.removeLayer(vectorLayer)
        }
      }
    }

    return () => {}
  }, [map])

  useEffect(() => {
    if (map) {
      GetVectorSource().clear(true)
      measurementsDrawed.forEach(measurement => {
        const feature = getFeature(measurement.feature?.geometry)

        if (!feature) {
          return
        }
        GetVectorSource().addFeature(feature)
      })
    }
  }, [measurementsDrawed, map])

  useEffect(() => {
    function addEmptyNextMeasurement() {
      setMeasurementInProgress({
        coordinates: null,
        distanceUnit: null,
        feature: null,
        measurement: null
      })
    }

    function startDrawing(event) {
      const firstTooltipCoordinates = event.coordinate

      setMeasurementInProgress({
        center: getCenter(event.feature.getGeometry().getExtent()),
        coordinates: event.feature.getGeometry().getLastCoordinate(),
        distanceUnit,
        measurement: 0
      })

      return event.feature.getGeometry().on('change', changeEvent => {
        function updateMeasurementOnNewPoint(e, tooltipCoordinates: Coordinate) {
          const geom = e.target
          let coordinates = tooltipCoordinates
          if (geom instanceof LineString) {
            const nextMeasurementOutput = getNauticalMilesOfLine(geom, distanceUnit)
            coordinates = geom.getLastCoordinate()
            setMeasurementInProgress({
              coordinates,
              distanceUnit,
              measurement: nextMeasurementOutput
            })
          } else if (geom instanceof Circle) {
            const nextMeasurementOutput = getNauticalMilesRadiusOfCircle(geom, distanceUnit)
            coordinates = geom.getLastCoordinate()

            dispatch(
              setCustomCircleMesurement({
                center: getCenter(geom.getExtent()),
                radius: nextMeasurementOutput
              })
            )

            setMeasurementInProgress({
              center: getCenter(geom.getExtent()),
              coordinates,
              distanceUnit,
              measurement: nextMeasurementOutput
            })
          }
        }

        updateMeasurementOnNewPoint(changeEvent, firstTooltipCoordinates)
      })
    }

    function drawNewFeatureOnMap() {
      if (!measurementTypeToAdd) {
        return
      }
      const draw = new Draw({
        source: GetVectorSource(),
        stopClick: true,
        style: [measurementStyle(), measurementStyleWithCenter],
        type: measurementTypeToAdd
      })
      let listener: EventsKey | EventsKey[]

      draw.on(DRAW_START_EVENT, event => {
        listener = startDrawing(event)
      })

      draw.on(DRAW_ABORT_EVENT, () => {
        unByKey(listener)
        dispatch(resetMeasurementTypeToAdd())
        setMeasurementInProgress(null)
      })

      draw.on(DRAW_END_EVENT, event => {
        dispatch(saveMeasurement(event.feature, measurementInProgressRef.current?.measurement ?? 0))
        unByKey(listener)
        dispatch(resetMeasurementTypeToAdd())
        setMeasurementInProgress(null)
      })
      currentInteraction.current = draw
      map?.addInteraction(currentInteraction.current)
    }

    if (map && measurementTypeToAdd) {
      addEmptyNextMeasurement()
      drawNewFeatureOnMap()
    }

    // we don't want to draw multiple circle if the user changes the distance unit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, map, measurementTypeToAdd])

  useEffect(() => {
    if (!measurementTypeToAdd) {
      setMeasurementInProgress(null)

      window.setTimeout(() => {
        if (currentInteraction.current) {
          map?.removeInteraction(currentInteraction.current)
        }
      }, 300)
    }
  }, [map, measurementTypeToAdd])

  const deleteFeature = useCallback(
    featureId => {
      const feature = GetVectorSource().getFeatureById(featureId)
      if (feature) {
        GetVectorSource().removeFeature(feature)
        GetVectorSource().changed()
      }

      dispatch(removeMeasurementDrawed(featureId))
    },
    [dispatch]
  )

  return (
    <>
      {measurementsDrawed.map(measurement => (
        <MeasurementOverlay
          key={measurement.feature?.id}
          coordinates={measurement.coordinates}
          deleteFeature={deleteFeature}
          id={measurement.feature?.id}
          map={map}
          measurement={measurement.measurement}
          type={measurement.feature?.geometry?.type}
        />
      ))}

      <div>
        {measurementInProgressRef.current ? (
          <MeasurementOverlay
            coordinates={measurementInProgressRef.current?.coordinates}
            map={map}
            measurement={measurementInProgressRef.current?.measurement}
            type={measurementTypeToAdd}
          />
        ) : null}
      </div>
    </>
  )
}
