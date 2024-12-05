import type { GeoJSON } from '../types/GeoJSON'
import type { Extent } from 'ol/extent'

export type AMPFromAPI = {
  designation: string
  geom: GeoJSON.MultiPolygon
  id: number
  name: string
  ref_reg: string | undefined
  type: string | undefined
  url_legicem: string | undefined
}
export type AMP = AMPFromAPI & { bbox: Extent }

export type AMPProperties = Omit<AMP, 'geometry' | 'geom'>
