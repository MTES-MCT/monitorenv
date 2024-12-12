import { getFeature } from '@utils/getFeature'
import { getArea } from 'ol/sphere'

import type { IsolatedLayerType } from 'domain/shared_slices/Map'

type RegulatoryFeatureType = {
  code: string
  isolatedLayer: IsolatedLayerType | undefined
  layer: any
}
export function getRegulatoryFeature({ code, isolatedLayer, layer }: RegulatoryFeatureType) {
  const feature = getFeature(layer.geom)
  if (!feature) {
    return undefined
  }
  const geometry = feature.getGeometry()
  const area = geometry && getArea(geometry)
  feature.setId(`${code}:${layer.id}`)

  const isolatedLayerTypeIsRegulatory = isolatedLayer?.type.includes('REGULATORY') ?? false
  const isLayerFilled = isolatedLayer
    ? isolatedLayerTypeIsRegulatory && isolatedLayer?.id === layer.id && isolatedLayer?.isFilled
    : true

  feature.setProperties({
    area,
    isFilled: isLayerFilled,
    layerId: layer.id,
    ...layer
  })

  return feature
}
