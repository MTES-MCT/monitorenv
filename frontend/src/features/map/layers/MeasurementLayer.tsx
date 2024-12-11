import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { getFeature } from '@utils/getFeature'
import { getCenter } from 'ol/extent'
import Feature from 'ol/Feature'
import Circle from 'ol/geom/Circle'
import LineString from 'ol/geom/LineString'
import { circular, fromCircle } from 'ol/geom/Polygon'
import Draw from 'ol/interaction/Draw'
import VectorLayer from 'ol/layer/Vector'
import { unByKey } from 'ol/Observable'
import { transform } from 'ol/proj'
import { METERS_PER_UNIT } from 'ol/proj/Units'
import VectorSource from 'ol/source/Vector'
import { getLength } from 'ol/sphere'
import { useCallback, useEffect, useRef } from 'react'

import { measurementStyle, measurementStyleWithCenter } from './styles/measurement.style'
import { Layers } from '../../../domain/entities/layers/constants'
import { DistanceUnit } from '../../../domain/entities/map/constants'
import {
  removeMeasurementDrawed,
  resetMeasurementTypeToAdd,
  setCircleMeasurementInDrawing
} from '../../../domain/shared_slices/Measurement'
import { saveMeasurement } from '../../../domain/use_cases/measurement/saveMeasurement'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { getNauticalMilesFromMeters } from '../../../utils/utils'
import { MeasurementOverlay } from '../overlays/MeasurementOverlay'

import type { BaseMapChildrenProps } from '../BaseMap'
import type { Geometry } from 'ol/geom'

type Measurement = {
  center: any
  coordinates: any
  distanceUnit: DistanceUnit
  measurement: number
}
const DRAW_START_EVENT = 'drawstart'
const DRAW_ABORT_EVENT = 'drawabort'
const DRAW_END_EVENT = 'drawend'

const getNauticalMilesRadiusOfCircle = (circle, distanceUnit) => {
  const polygon = fromCircle(circle)

  return getNauticalMilesRadiusOfCircularPolygon(polygon, distanceUnit)
}

const getNauticalMilesOfLine = (line, distanceUnit) => {
  const length = getLength(line)

  if (distanceUnit === DistanceUnit.METRIC) {
    return Math.round(length)
  }

  return getNauticalMilesFromMeters(length)
}

function getNauticalMilesRadiusOfCircularPolygon(polygon, distanceUnit) {
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

  const { circleMeasurementToAdd, measurementsDrawed, measurementTypeToAdd } = useAppSelector(
    state => state.measurement
  )
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
        style: [measurementStyle, measurementStyleWithCenter],
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
    if (measurementsDrawed && map) {
      GetVectorSource().clear(true)
      measurementsDrawed.forEach(measurement => {
        const feature = getFeature(measurement.feature)

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
        function updateMeasurementOnNewPoint(e, tooltipCoordinates) {
          const geom = e.target
          let coordinates = tooltipCoordinates

          if (geom instanceof LineString) {
            const nextMeasurementOutput = getNauticalMilesOfLine(geom, distanceUnit)
            coordinates = geom.getLastCoordinate()

            setMeasurementInProgress({
              coordinates: tooltipCoordinates,
              distanceUnit,
              measurement: nextMeasurementOutput
            })
          } else if (geom instanceof Circle) {
            const nextMeasurementOutput = getNauticalMilesRadiusOfCircle(geom, distanceUnit)
            coordinates = geom.getLastCoordinate()

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
        style: [measurementStyle, measurementStyleWithCenter],
        type: measurementTypeToAdd
      })
      let listener

      draw.on(DRAW_START_EVENT, event => {
        listener = startDrawing(event)
      })

      draw.on(DRAW_ABORT_EVENT, () => {
        unByKey(listener)
        dispatch(resetMeasurementTypeToAdd())
        setMeasurementInProgress(null)
      })

      draw.on(DRAW_END_EVENT, event => {
        dispatch(saveMeasurement(event.feature, measurementInProgressRef.current?.measurement))
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
    // we don't want to draw  multiple circle if the user changes the distance unit
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

  useEffect(() => {
    function addCustomCircleMeasurement() {
      const metersForOneNauticalMile = 1852
      const longitude = 1
      const latitude = 0
      const numberOfVertices = 64

      if (
        !circleMeasurementHasCoordinatesAndRadiusFromForm() &&
        !circleMeasurementHasRadiusFromFormAndCoordinatesFromDraw()
      ) {
        return
      }

      function circleMeasurementHasCoordinatesAndRadiusFromForm() {
        return circleMeasurementToAdd?.circleCoordinatesToAdd?.length === 2 && circleMeasurementToAdd?.circleRadiusToAdd
      }

      function circleMeasurementHasRadiusFromFormAndCoordinatesFromDraw() {
        return circleMeasurementToAdd?.circleRadiusToAdd && measurementInProgressRef.current?.center?.length === 2
      }

      let radiusInMeters =
        METERS_PER_UNIT.m * (circleMeasurementToAdd?.circleRadiusToAdd || 0) * metersForOneNauticalMile

      if (distanceUnit === DistanceUnit.METRIC) {
        radiusInMeters = METERS_PER_UNIT.m * (circleMeasurementToAdd?.circleRadiusToAdd || 0)
      }
      let coordinates: number[] = []
      if (circleMeasurementHasCoordinatesAndRadiusFromForm()) {
        coordinates = [
          circleMeasurementToAdd?.circleCoordinatesToAdd[longitude],
          circleMeasurementToAdd?.circleCoordinatesToAdd[latitude]
        ]
      } else if (circleMeasurementHasRadiusFromFormAndCoordinatesFromDraw()) {
        coordinates = transform(measurementInProgressRef.current?.center, OPENLAYERS_PROJECTION, WSG84_PROJECTION)
      }

      const circleFeature = new Feature({
        geometry: circular(coordinates, radiusInMeters, numberOfVertices).transform(
          WSG84_PROJECTION,
          OPENLAYERS_PROJECTION
        ),
        style: [measurementStyle, measurementStyleWithCenter]
      })

      dispatch(saveMeasurement(circleFeature, circleMeasurementToAdd?.circleRadiusToAdd))
    }

    addCustomCircleMeasurement()
    // we don't want to add the circle measurement if the user changes the distance unit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, circleMeasurementToAdd])

  useEffect(() => {
    if (measurementInProgressRef.current?.center || measurementInProgressRef.current?.measurement) {
      dispatch(
        setCircleMeasurementInDrawing({
          coordinates: measurementInProgressRef.current.center,
          measurement: measurementInProgressRef.current.measurement
        })
      )
    }
  }, [dispatch])

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
          key={measurement.feature.id}
          coordinates={measurement.coordinates}
          deleteFeature={deleteFeature}
          id={measurement.feature.id}
          map={map}
          measurement={measurement.measurement}
          type={measurement.feature.geometry.type}
        />
      ))}

      <div>
        {measurementInProgressRef.current ? (
          <MeasurementOverlay
            coordinates={measurementInProgressRef.current?.coordinates}
            map={map}
            measurement={measurementInProgressRef.current?.measurement}
          />
        ) : null}
      </div>
    </>
  )
}
