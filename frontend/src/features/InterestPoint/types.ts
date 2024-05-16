import type { Coordinates, IconProps } from '@mtes-mct/monitor-ui'
import type Feature from 'ol/Feature'
import type { LineString } from 'ol/geom'
import type { FunctionComponent } from 'react'

export type InterestPoint = {
  coordinates: Coordinates
  feature?: Feature<LineString>
  name: string
  observations: string
  // type: string
  uuid: string
}

export type NewInterestPoint = {
  coordinates: Coordinates | null
  feature?: Feature<LineString>
  name: string | null
  observations: string | null
  // type: string | null
  uuid: string
}

export type InterestPointOptionValueType = {
  icon: FunctionComponent<IconProps>
  value: string
}
