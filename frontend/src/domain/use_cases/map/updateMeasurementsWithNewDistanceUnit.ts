import { getNauticalMilesFromMeters } from '../../../utils/utils'
import { DistanceUnit } from '../../entities/map/constants'
import { setMeasurementDrawedDistanceUnit } from '../../shared_slices/Measurement'

export const updateMeasurementsWithNewDistanceUnit = () => (dispatch, getState) => {
  const {
    map: { distanceUnit: globalDistanceUnit },
    measurement: { measurementsDrawed }
  } = getState()

  const metersForOneNauticalMile = 1852

  const newDrawedMeasurements = measurementsDrawed.map(drawedMeasurement => {
    const { distanceUnit = DistanceUnit.NAUTICAL, measurement } = drawedMeasurement

    if (globalDistanceUnit === DistanceUnit.NAUTICAL) {
      const newMeasurement =
        distanceUnit === DistanceUnit.METRIC ? getNauticalMilesFromMeters(measurement) : measurement

      return { ...drawedMeasurement, distanceUnit: globalDistanceUnit, measurement: newMeasurement }
    }

    const newMeasurement = distanceUnit === DistanceUnit.NAUTICAL ? measurement * metersForOneNauticalMile : measurement

    return { ...drawedMeasurement, distanceUnit: globalDistanceUnit, measurement: newMeasurement }
  })
  dispatch(setMeasurementDrawedDistanceUnit(newDrawedMeasurements))
}
