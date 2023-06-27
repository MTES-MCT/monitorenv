import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { Extent, intersects } from 'ol/extent'
import { transformExtent } from 'ol/proj'

export const getIntersectingLayerIds = <T>(
  shouldFilter: Boolean,
  layers: T[],
  extent: Extent | undefined,
  { bboxPath = 'bbox', idPath = 'id' }: { bboxPath?: string; idPath?: string } = {}
): number[] => {
  if (!shouldFilter || !extent) {
    return layers.map(layer => _.get(layer, idPath))
  }
  const currentExtent = transformExtent(extent, OPENLAYERS_PROJECTION, WSG84_PROJECTION)

  return layers.reduce((layerIds, layer) => {
    const bbox = _.get(layer, bboxPath)
    if (bbox && intersects(bbox, currentExtent)) {
      return layerIds.concat(_.get(layer, idPath))
    }

    return layerIds
  }, [] as number[])
}
