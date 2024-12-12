import { getFeature } from '@utils/getFeature'
import { getArea } from 'ol/sphere'

import { getIsolatedLayerIsAmp } from '../utils'

export function getAMPFeature({ code, isolatedLayer, layer }) {
  const feature = getFeature(layer.geom)
  if (!feature) {
    return undefined
  }
  const isolatedLayerTypeIsAmp = getIsolatedLayerIsAmp(isolatedLayer)
  const geometry = feature.getGeometry()
  const area = geometry && getArea(geometry)
  feature.setId(`${code}:${layer.id}`)

  const isLayerFilled = isolatedLayer
    ? isolatedLayerTypeIsAmp && isolatedLayer?.id === layer.id && isolatedLayer?.isFilled
    : true
  feature.setProperties({
    area,
    isFilled: isLayerFilled,
    layerId: layer.id,
    ...layer
  })

  return feature
}
