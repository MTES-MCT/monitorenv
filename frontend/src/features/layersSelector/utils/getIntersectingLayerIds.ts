import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { get } from 'lodash-es'
import { type Extent, intersects } from 'ol/extent'
import { transformExtent } from 'ol/proj'

export const getIntersectingLayerIds = <T>(
  shouldFilter: Boolean,
  layers: T[] | undefined,
  extent: Extent | undefined,
  { bboxPath = 'bbox', idPath = 'id' }: { bboxPath?: string; idPath?: string } = {}
): number[] => {
  if (!layers) {
    return []
  }
  if (!shouldFilter || !extent) {
    return layers.map(layer => get(layer, idPath))
  }
  const currentExtent = transformExtent(extent, OPENLAYERS_PROJECTION, WSG84_PROJECTION)

  return layers.reduce((layerIds, layer) => {
    const bbox = get(layer, bboxPath)
    if (bbox && intersects(bbox, currentExtent)) {
      return layerIds.concat(get(layer, idPath))
    }

    return layerIds
  }, [] as number[])
}
