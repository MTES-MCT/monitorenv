import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { Layers } from 'domain/entities/layers/constants'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'
import { getArea } from 'ol/sphere'

import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { IsolatedLayerType } from 'domain/shared_slices/Map'

export const getVigilanceAreaZoneFeature = (
  vigilanceArea: VigilanceArea.VigilanceArea,
  layername: string,
  isolatedLayer: IsolatedLayerType | undefined,
  isSelected?: boolean
) => {
  const geoJSON = new GeoJSON()
  const geometry = geoJSON.readGeometry(vigilanceArea.geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })
  const area = geometry && getArea(geometry)

  const feature = new Feature({
    geometry
  })

  const isolatedLayerIsVigilanceArea = isolatedLayer?.type.includes('VIGILANCE_AREA') ?? false
  const isLayerFilled = isolatedLayer
    ? isolatedLayerIsVigilanceArea && isolatedLayer?.id === vigilanceArea.id && isolatedLayer?.isFilled
    : true

  feature.setId(`${layername}:${vigilanceArea.id}`)
  feature.setProperties({
    area,
    ...vigilanceArea,
    isFilled: isLayerFilled,
    isSelected
  })

  return feature
}

export const getFormattedGeomForFeature = (geom, vigilanceArea) => {
  const geoJSON = new GeoJSON()
  const geometry = geoJSON.readGeometry(geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })
  const area = geometry && getArea(geometry)

  const feature = new Feature({
    geometry
  })
  const id = vigilanceArea?.id || 0
  feature.setId(`${Layers.VIGILANCE_AREA.code}:${id}`)
  feature.setProperties({
    area,
    ...vigilanceArea,
    isFilled: true,
    ...(vigilanceArea && { isSelected: true })
  })

  return feature
}
