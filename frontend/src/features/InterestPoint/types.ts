import type { IconProps } from '@mtes-mct/monitor-ui'
import type { Coordinate } from 'ol/coordinate'
import type Feature from 'ol/Feature'
import type { LineString } from 'ol/geom'
import type { FunctionComponent } from 'react'

export type InterestPoint = {
  coordinates: Coordinate
  feature?: Feature<LineString>
  name: string
  observations: string
  uuid: string
}

export type NewInterestPoint = {
  coordinates: Coordinate | null
  feature?: Feature<LineString>
  name: string | null
  observations: string | null
  uuid: string
}

export type InterestPointOptionValueType = {
  icon: FunctionComponent<IconProps>
  value: string
}
