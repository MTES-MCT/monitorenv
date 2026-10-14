import type { GeoJSON } from '../types/GeoJSON'
import type { Extent } from 'ol/extent'

export type AMP = {
  designation: string
  extent: Extent
  geom: GeoJSON.MultiPolygon
  id: number
  isNew: boolean
  name: string
  refReg: string | undefined
  type: string | undefined
  updatedAt?: string
  urlLegicem: string | undefined
}

export type AMPProperties = Omit<AMP, 'geometry' | 'geom'>
