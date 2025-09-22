import { getNauticalMilesFromMeters } from '../../../utils/utils'
import { DistanceUnit } from '../../entities/map/constants'
import { setMeasurementDrawedDistanceUnit } from '../../shared_slices/Measurement'

import type { HomeAppThunk } from '@store/index'

export const updateMeasurementsWithNewDistanceUnit =
  (newDistanceUnit: DistanceUnit): HomeAppThunk =>
  (dispatch, getState) => {
    const { measurementsDrawed } = getState().measurement

    const metersForOneNauticalMile = 1852

    const newDrawedMeasurements = measurementsDrawed.map(drawedMeasurement => {
      const { distanceUnit, measurement } = drawedMeasurement

      if (newDistanceUnit === DistanceUnit.NAUTICAL) {
        const newMeasurement =
          distanceUnit === DistanceUnit.METRIC ? getNauticalMilesFromMeters(measurement) : measurement

        return { ...drawedMeasurement, distanceUnit: newDistanceUnit, measurement: newMeasurement }
      }

      if (newDistanceUnit === DistanceUnit.METRIC) {
        const newMeasurement =
          distanceUnit === DistanceUnit.NAUTICAL ? measurement * metersForOneNauticalMile : measurement

        return { ...drawedMeasurement, distanceUnit: newDistanceUnit, measurement: newMeasurement }
      }

      return drawedMeasurement
    })
    dispatch(setMeasurementDrawedDistanceUnit(newDrawedMeasurements))
  }
