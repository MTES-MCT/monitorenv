import { getFeature } from '@utils/getFeature'
import { getArea } from 'ol/sphere'

export function getRegulatoryFeature({ code, layer }) {
  const feature = getFeature(layer.geometry_simplified)
  if (!feature) {
    return undefined
  }
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
