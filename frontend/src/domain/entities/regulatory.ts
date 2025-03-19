import type { ThemeAPI } from './themes'
import type { GeoJSON } from '../types/GeoJSON'

export type RegulatoryLayerWithMetadataFromAPI = {
  entityName: string
  facade: string
  geom: GeoJSON.MultiPolygon
  id: number
  layerName: string
  refReg: string
  themes: ThemeAPI[]
  type: string
  url: string
}

export type RegulatoryLayerCompactFromAPI = {
  entityName: string
  geom: GeoJSON.MultiPolygon
  id: number
  layerName: string
  refReg: string
  themes: ThemeAPI[]
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
