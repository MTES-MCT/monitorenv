import type { GeoJSON } from '../types/GeoJSON'
import type { Extent } from 'ol/extent'

export type AMPFromAPI = {
  designation: string
  geom: GeoJSON.MultiPolygon
  id: number
  name: string
  type: string
  type_cacem: string | null
  url_legicem: string | null
}
export type AMP = AMPFromAPI & { bbox: Extent }
