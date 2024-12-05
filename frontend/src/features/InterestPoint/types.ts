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
  coordinates: Coordinate | undefined
  feature?: Feature<LineString>
  name: string | undefined
  observations: string | undefined
  uuid: string
}

export type InterestPointOptionValueType = {
  icon: FunctionComponent<IconProps>
  value: string
}
