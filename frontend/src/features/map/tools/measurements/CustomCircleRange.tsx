import {
  coordinatesAreDistinct,
  CoordinatesInput,
  NumberInput,
  OPENLAYERS_PROJECTION,
  WSG84_PROJECTION
} from '@mtes-mct/monitor-ui'
import { Feature } from 'ol'
import { circular } from 'ol/geom/Polygon'
import { METERS_PER_UNIT, transform } from 'ol/proj'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { DistanceUnit, MeasurementType } from '../../../../domain/entities/map/constants'
import { setIsMapToolVisible } from '../../../../domain/shared_slices/Global'
import { setFitToExtent } from '../../../../domain/shared_slices/Map'
import {
  resetCircleMeasurementInDrawing,
  setCustomCircleMesurement,
  setMeasurementTypeToAdd
} from '../../../../domain/shared_slices/Measurement'
import { saveMeasurement } from '../../../../domain/use_cases/measurement/saveMeasurement'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { MapToolBox } from '../MapToolBox'

export function CustomCircleRange() {
  const dispatch = useAppDispatch()
  const { customCircleMesurement, measurementTypeToAdd } = useAppSelector(state => state.measurement)
  const { healthcheckTextWarning } = useAppSelector(state => state.global)
  const { coordinatesFormat, distanceUnit } = useAppSelector(state => state.map)

  const circleCenterCoordinates = useMemo(() => {
    if (measurementTypeToAdd !== MeasurementType.CIRCLE_RANGE || !customCircleMesurement?.center) {
      return []
    }
    const [longitude, latitude] = transform(customCircleMesurement?.center, OPENLAYERS_PROJECTION, WSG84_PROJECTION)

    return longitude && latitude ? [latitude, longitude] : []
  }, [measurementTypeToAdd, customCircleMesurement?.center])

  const circleRadius = useMemo(() => {
    if (measurementTypeToAdd !== MeasurementType.CIRCLE_RANGE) {
      return undefined
    }

    return customCircleMesurement?.radius
  }, [measurementTypeToAdd, customCircleMesurement?.radius])

  /**
   * Compare with previous coordinates and update interest point coordinates
   * @param {number[]} nextCoordinates - Coordinates ([latitude, longitude]) to update, in decimal format.
   * @param {number[]} coordinates - Previous coordinates ([latitude, longitude]), in decimal format.
   */
  const updateCoordinates = nextCoordinates => {
    if (!nextCoordinates?.length) {
      return
    }

    if (!circleCenterCoordinates || coordinatesAreDistinct(nextCoordinates, circleCenterCoordinates)) {
      dispatch(
        setCustomCircleMesurement({
          center: nextCoordinates,
          radius: customCircleMesurement?.radius
        })
      )
    }
  }

  const updateCustomCircleRadius = useCallback(
    (nextCircleRadius: number | undefined) => {
      dispatch(
        setCustomCircleMesurement({
          center: customCircleMesurement?.center,
          radius: nextCircleRadius
        })
      )
    },
    [customCircleMesurement?.center, dispatch]
  )

  const addCustomCircleRange = useCallback(() => {
    if (!customCircleMesurement?.center || !circleRadius) {
      return
    }
    const metersForOneNauticalMile = 1852

    let radiusInMeters = METERS_PER_UNIT.m * circleRadius * metersForOneNauticalMile

    if (distanceUnit === DistanceUnit.METRIC) {
      radiusInMeters = METERS_PER_UNIT.m * circleRadius
    }

    const numberOfVertices = 64

    const formattedCircleCenter = transform(customCircleMesurement?.center, OPENLAYERS_PROJECTION, WSG84_PROJECTION)
    // We need to set feature with geom as WSG84_PROJECTION then convert feature geom to OPENLAYERS_PROJECTION
    const circleFeature = new Feature({
      geometry: circular(formattedCircleCenter, radiusInMeters, numberOfVertices).transform(
        WSG84_PROJECTION,
        OPENLAYERS_PROJECTION
      )
    })
    dispatch(saveMeasurement(circleFeature, circleRadius))
    const extent = circleFeature.getGeometry()?.getExtent()
    if (extent) {
      dispatch(setFitToExtent(extent))
    }

    dispatch(setMeasurementTypeToAdd(undefined))
    resetCircleMeasurementInDrawing()
  }, [customCircleMesurement?.center, circleRadius, distanceUnit, dispatch])

  const cancelAddCircleRange = useCallback(() => {
    dispatch(setMeasurementTypeToAdd(null))
    dispatch(resetCircleMeasurementInDrawing())
    dispatch(setIsMapToolVisible(undefined))
  }, [dispatch])

  return (
    <Wrapper
      $healthcheckTextWarning={!!healthcheckTextWarning}
      $isOpen={measurementTypeToAdd === MeasurementType.CIRCLE_RANGE}
    >
      <Header>Définir une valeur</Header>
      <Body>
        <CoordinatesInput
          coordinatesFormat={coordinatesFormat}
          defaultValue={circleCenterCoordinates}
          label="Coordonnées"
          name="coordinates"
          onChange={updateCoordinates}
        />
        <RadiusWrapper>
          <NumberInput
            data-cy="measurement-circle-radius-input"
            label="Distance (rayon)"
            name="circleRadius"
            onChange={nextValue => updateCustomCircleRadius(nextValue)}
            style={{ width: 115 }}
            value={circleRadius}
          />
          <span>{distanceUnit === DistanceUnit.METRIC ? '(Mètres)' : '(Nm)'}</span>
        </RadiusWrapper>
        <OkButton
          data-cy="measurement-circle-add"
          disabled={!circleCenterCoordinates?.length || !circleRadius}
          onClick={() => addCustomCircleRange()}
        >
          OK
        </OkButton>
        <CancelButton onClick={cancelAddCircleRange}>Annuler</CancelButton>
      </Body>
    </Wrapper>
  )
}

const CancelButton = styled.button`
  border: 1px solid ${p => p.theme.color.charcoal};
  color: ${p => p.theme.color.gunMetal};
  font-size: 13px;
  margin: 15px 0 0 15px;
  padding: 5px 12px;
  width: 130px;

  &:disabled {
    border: 1px solid ${p => p.theme.color.lightGray};
    color: ${p => p.theme.color.lightGray};
  }
`

const OkButton = styled.button`
  background: ${p => p.theme.color.charcoal};
  color: ${p => p.theme.color.gainsboro};
  font-size: 13px;
  margin: 15px 0 0;
  padding: 5px 12px;
  width: 130px;

  &:hover,
  &:focus {
    background: ${p => p.theme.color.charcoal};
  }
`

const Body = styled.div`
  color: ${p => p.theme.color.slateGray};
  font-size: 13px;
  margin: 10px 15px;
  text-align: left;

  p {
    font-size: 13px;
    margin: 0;
  }

  p:nth-of-type(2) {
    font-size: 13px;
    margin-top: 15px;
  }

  span {
    margin-left: 7px;
  }

  input {
    background: ${p => p.theme.color.gainsboro};
    border: none;
    color: ${p => p.theme.color.gunMetal};
    height: 27px;
    margin-top: 7px;
    padding-left: 8px;
  }
`

const Header = styled.div`
  background: ${p => p.theme.color.charcoal};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  color: ${p => p.theme.color.gainsboro};
  font-size: 16px;
  padding: 9px 0 7px 15px;
  text-align: left;
`

const Wrapper = styled(MapToolBox)`
  width: 306px;
`

const RadiusWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: last baseline;
`
