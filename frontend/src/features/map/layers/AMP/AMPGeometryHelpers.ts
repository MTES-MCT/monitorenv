import { OPENLAYERS_PROJECTION } from '@mtes-mct/monitor-ui'
import { GeoJSON } from 'ol/format'
import { getArea } from 'ol/sphere'

import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function getAMPFeature({ code, layer }) {
  const feature = new GeoJSON({
    featureProjection: OPENLAYERS_PROJECTION
  }).readFeature(layer.geom) as Feature<Geometry>
  const geometry = feature.getGeometry()
  const area = geometry && getArea(geometry)
  feature.setId(`${code}:${layer.id}`)

  feature.setProperties({
    area,
    layerId: layer.id,
    ...layer
  })

  return feature
}
