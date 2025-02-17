import { omit } from 'lodash-es'

import type { StationFormValues } from './types'
import type { Station } from '../../../../domain/entities/station'

export function getStationDataFromStationFormValues(baseFormValues: StationFormValues): Station.StationData {
  return {
    ...omit(baseFormValues, ['coordinates']),
    latitude: baseFormValues.coordinates![0],
    longitude: baseFormValues.coordinates![1]
  } as Station.StationData
}

export function getStationFormValuesFromStation(base: Station.Station): StationFormValues {
  return {
    ...base,
    coordinates: [base.latitude, base.longitude]
  }
}

export function isStationData(stationData: Station.StationData): stationData is Station.StationData {
  return stationData.id !== undefined
}
