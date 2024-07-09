import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { Layers } from 'domain/entities/layers/constants'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'

import type { VigilanceArea } from '@features/VigilanceArea/types'

export const getVigilanceAreaZoneFeature = (
  vigilanceArea: VigilanceArea.VigilanceArea,
  layername: string,
  metadataIsShowed?: boolean
) => {
  const geoJSON = new GeoJSON()
  const geometry = geoJSON.readGeometry(vigilanceArea.geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })

  const feature = new Feature({
    geometry
  })
  feature.setId(`${layername}:${vigilanceArea.id}`)
  feature.setProperties({
    ...vigilanceArea,
    metadataIsShowed
  })

  return feature
}

export const getFormattedGeomForFeature = geom => {
  const geoJSON = new GeoJSON()
  const geometry = geoJSON.readGeometry(geom, {
    dataProjection: WSG84_PROJECTION,
    featureProjection: OPENLAYERS_PROJECTION
  })

  const feature = new Feature({
    geometry
  })
  feature.setId(`${Layers.VIGILANCE_AREA.code}:0`)

  return feature
}