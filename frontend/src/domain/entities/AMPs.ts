import type { GeoJSON } from '../types/GeoJSON'
import type { Extent } from 'ol/extent'

export type AMPFromAPI = {
  designation: string
  geom: GeoJSON.MultiPolygon
  id: number
  name: string
  type: string
  url_legicem: string | null
}
export type AMP = AMPFromAPI & { bbox: Extent }
