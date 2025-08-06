import type { GeoJSON } from '../types/GeoJSON'
import type { Extent } from 'ol/extent'

export type AMPFromAPI = {
  designation: string
  geom: GeoJSON.MultiPolygon | undefined
  id: number
  name: string
  refReg: string | undefined
  type: string | undefined
  urlLegicem: string | undefined
}
export type AMP = AMPFromAPI & { bbox: Extent }

export type AMPProperties = Omit<AMP, 'geometry' | 'geom'>
