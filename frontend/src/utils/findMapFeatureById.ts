import type { VectorLayerWithName } from '../domain/types/layer'
import type { Feature, Map } from 'ol'
import type { Geometry } from 'ol/geom'

export function findMapFeatureById(
  map: Map | undefined,
  layerName: string,
  featureId: string | undefined
): Feature<Geometry> | undefined {
  if (!map || !featureId) {
    return undefined
  }

  const foundVectorLayerWithName = map
    .getLayers()
    .getArray()
    .find(
      (baseLayer): baseLayer is VectorLayerWithName =>
        Object.prototype.hasOwnProperty.call(baseLayer, 'name') && (baseLayer as VectorLayerWithName).name === layerName
    )
  if (!foundVectorLayerWithName) {
    return undefined
  }

  return foundVectorLayerWithName.getSource()?.getFeatureById(featureId) || undefined
}
