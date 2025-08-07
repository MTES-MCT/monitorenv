import { getFeature } from '@utils/getFeature'
import { getArea } from 'ol/sphere'

export function getAMPFeature({ code, isolatedLayer, layer }) {
  const feature = getFeature(layer.geom)
  if (!feature) {
    return undefined
  }
  const geometry = feature.getGeometry()
  const area = geometry && getArea(geometry)
  feature.setId(`${code}:${layer.id}`)

  const isolatedLayerTypeIsAmp = isolatedLayer?.type.includes('AMP') ?? false
  const isLayerFilled = isolatedLayer
    ? isolatedLayerTypeIsAmp && isolatedLayer?.id === layer.id && isolatedLayer?.isFilled
    : true

  feature.setProperties({
    area,
    isFilled: isLayerFilled,
    layerId: layer.id,
    ...layer,
    geom: null
  })

  return feature
}
