import type { GeoJSON } from 'domain/types/GeoJSON'

export namespace LocalizedArea {
  export interface LocalizedArea {
    ampIds?: number[]
    controlUnitIds?: number[]
    geom: GeoJSON.MultiPolygon
    groupName: string
    id: number
    name: string
  }
  export type LocalizedAreaWithBbox = LocalizedArea & { bbox: number[] }
}
