import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'

import { Layers } from '../../../../domain/entities/layers/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../domain/entities/map/constants'

import type { Base } from '../../../../domain/entities/base'

export const getBasePointFeature = (base: Base.Base) => {
  const geoJSON = new GeoJSON()
  const geometry = geoJSON.readGeometry(
    {
      coordinates: [base.longitude, base.latitude],
      type: 'Point'
    },
    {
      dataProjection: WSG84_PROJECTION,
      featureProjection: OPENLAYERS_PROJECTION
    }
  )

  const feature = new Feature({
    geometry
  })
  feature.setId(`${Layers.BASES.code}:${base.id}`)
  feature.setProperties({
    base,
    isHighlighted: false,
    isSelected: false
  })

  return feature
}
