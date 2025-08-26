import { DistanceUnit } from '../../../domain/entities/map/constants'

import type { SerializedFeature } from '../../../domain/types/map'
import type { Coordinate } from 'ol/coordinate'

export type Measurement = {
  center?: Coordinate | undefined
  coordinates: number[] | undefined
  distanceUnit: DistanceUnit
  feature?: SerializedFeature<Record<string, any>> | undefined
  measurement: number
}
