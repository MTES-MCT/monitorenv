import type { GeoJSON } from '../types/GeoJSON'

export type RegulatoryLayerWithMetadataFromAPI = {
  entity_name: string
  facade: string
  geom: GeoJSON.MultiPolygon
  geometry_simplified: GeoJSON.MultiPolygon
  id: number
  layer_name: string
  ref_reg: string
  thematique: string
  type: string
  url: string
}

export type RegulatoryLayerCompactFromAPI = {
  entity_name: string
  geom: GeoJSON.MultiPolygon
  geometry_simplified: GeoJSON.MultiPolygon
  id: number
  layer_name: string
  ref_reg: string
  thematique: string
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
