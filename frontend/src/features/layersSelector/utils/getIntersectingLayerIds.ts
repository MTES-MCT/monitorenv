import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { type Extent, intersects } from 'ol/extent'
import { transformExtent } from 'ol/proj'

export const getIntersectingLayerIds = <T>(
  shouldFilter: boolean,
  layers: T[] | undefined,
  extent: Extent | undefined,
  { bboxPath = 'bbox', idPath = 'id' }: { bboxPath?: string; idPath?: string } = {}
): number[] => {
  if (!layers) {
    return []
  }
  if (!shouldFilter || !extent) {
    return layers.map(layer => layer[idPath])
  }
  const currentExtent = transformExtent(extent, OPENLAYERS_PROJECTION, WSG84_PROJECTION)

  return layers.reduce((layerIds, layer) => {
    const bbox = layer[bboxPath]
    if (bbox && intersects(bbox, currentExtent)) {
      return layerIds.concat(layer[idPath])
    }

    return layerIds
  }, [] as number[])
}

export const getIntersectingLayers = <T>(
  shouldFilter: boolean,
  layers: T[] | undefined,
  extent: Extent | undefined,
  { bboxPath = 'bbox' }: { bboxPath?: string } = {}
): T[] => {
  if (!layers) {
    return []
  }
  if (!shouldFilter || !extent) {
    return layers
  }
  const currentExtent = transformExtent(extent, OPENLAYERS_PROJECTION, WSG84_PROJECTION)

  return layers.reduce((intersectLayers, layer) => {
    const bbox = layer[bboxPath]
    if (bbox && intersects(bbox, currentExtent)) {
      return intersectLayers.concat(layer)
    }

    return intersectLayers
  }, [] as T[])
}
