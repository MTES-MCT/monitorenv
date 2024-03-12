import type { GeoJSON } from '../types/GeoJSON'

export const getTitle = topic => (topic ? `${topic?.replace(/[_]/g, ' ')}` : '')

export type RegulatoryLayerFromAPI = {
  entity_name: string
  facade: string
  geom: GeoJSON.MultiPolygon
  id: number
  layer_name: string
  ref_reg: string
  thematique: string
  type: string
  url: string
}

export type RegulatoryLayersFromAPI = {
  entity_name: string
  geom: GeoJSON.MultiPolygon
  id: number
  layer_name: string
  ref_reg: string
  thematique: string
}
export type RegulatoryLayers = RegulatoryLayersFromAPI & { bbox: number[] }

export type RegulatoryLayer = RegulatoryLayerFromAPI & { bbox: number[] }
