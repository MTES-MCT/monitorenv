import type { Coordinates } from '@mtes-mct/monitor-ui'
import type Feature from 'ol/Feature'
import type { LineString } from 'ol/geom'

export type InterestPoint = {
  coordinates: Coordinates
  feature?: Feature<LineString>
  name: string
  observations: string
  type: string
  uuid: string
}

export type NewInterestPoint = {
  coordinates: Coordinates | null
  feature?: Feature<LineString>
  name: string | null
  observations: string | null
  type: string | null
  uuid: string
}
