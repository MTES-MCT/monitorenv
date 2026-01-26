import type { TagFromAPI } from './tags'
import type { ThemeFromAPI } from './themes'
import type { GeoJSON } from '../types/GeoJSON'

export type RegulatoryLayerWithMetadataFromAPI = {
  facade: string
  geom: GeoJSON.MultiPolygon
  id: number
  layerName: string
  plan: string
  polyName: string
  refReg: string
  resume: string
  tags: TagFromAPI[]
  themes: ThemeFromAPI[]
  type: string
  url: string
}

export type RegulatoryLayerCompactFromAPI = {
  geom: GeoJSON.MultiPolygon | undefined
  id: number
  layerName: string
  plan: string
  polyName: string
  refReg: string
  resume: string
  tags: TagFromAPI[]
  themes: ThemeFromAPI[]
  type: string
}
export type RegulatoryLayerCompact = RegulatoryLayerCompactFromAPI & { bbox: number[] }

export type RegulatoryLayerWithMetadata = RegulatoryLayerWithMetadataFromAPI & { bbox: number[] }

export type RegulatoryLayerWithMetadataProperties = Omit<RegulatoryLayerWithMetadata, 'geom'> & {
  area: number | undefined
  layerId: number
}

export type RegulatoryLayerCompactProperties = Omit<RegulatoryLayerCompact, 'geom'> & {
  area: number | undefined
  layerId: number
  metadataIsShowed: boolean
}
