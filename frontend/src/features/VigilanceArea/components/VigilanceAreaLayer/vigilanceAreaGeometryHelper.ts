import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { Layers } from 'domain/entities/layers/constants'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'
import { getArea } from 'ol/sphere'

import type { VigilanceArea } from '@features/VigilanceArea/types'

export const getVigilanceAreaZoneFeature = (
  vigilanceArea: VigilanceArea.VigilanceArea,
  layername: string,
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
  feature.setId(`${layername}:${vigilanceArea.id}`)
  feature.setProperties({
    area,
    ...vigilanceArea,
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
    ...(vigilanceArea && { isSelected: true })
  })

  return feature
}
