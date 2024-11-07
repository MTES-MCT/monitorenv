import { OPENLAYERS_PROJECTION } from '@mtes-mct/monitor-ui'
import { GeoJSON } from 'ol/format'

import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

export function getFeature(geometry): Feature<Geometry> | undefined {
  if (!geometry) {
    return undefined
  }

  return new GeoJSON({
    featureProjection: OPENLAYERS_PROJECTION
  }).readFeature(geometry) as Feature<Geometry>
}
