import { getFeature } from '@utils/getFeature'
import { getArea } from 'ol/sphere'

type RegulatoryFeatureType = {
  code: string
  isFilled?: boolean
  layer: any
}
export function getRegulatoryFeature({ code, isFilled = true, layer }: RegulatoryFeatureType) {
  const feature = getFeature(layer.geom)
  if (!feature) {
    return undefined
  }
  const geometry = feature.getGeometry()
  const area = geometry && getArea(geometry)
  feature.setId(`${code}:${layer.id}`)

  feature.setProperties({
    area,
    isFilled,
    layerId: layer.id,
    ...layer
  })

  return feature
}
