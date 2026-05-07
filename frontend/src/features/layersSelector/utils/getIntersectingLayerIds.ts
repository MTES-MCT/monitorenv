import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { get } from 'lodash'
import { boundingExtent, type Extent, intersects } from 'ol/extent'
import { transformExtent } from 'ol/proj'

import type { Coordinate } from 'ol/coordinate'

export const getIntersectingLayerIds = <T>(
  shouldFilter: boolean,
  layers: T[] | undefined,
  extent: Extent | undefined,
  { bboxPath = 'bbox', idPath = 'id' }: { bboxPath?: string; idPath?: string } = {},
  withGeom = false
): number[] => {
  if (!layers) {
    return []
  }

  if (!shouldFilter || !extent) {
    return layers.map(layer => get(layer, idPath))
  }

  const currentExtent = transformExtent(extent, OPENLAYERS_PROJECTION, WSG84_PROJECTION)

  return layers.reduce<number[]>((layerIds, layer) => {
    let bbox
    if (withGeom) {
      const coordinates = get(layer, 'geom.coordinates') as { flat: () => { flat: () => Coordinate[] } } | undefined
      bbox = coordinates ? boundingExtent(coordinates.flat().flat()) : undefined
    } else {
      bbox = get(layer, bboxPath)
    }
    if (bbox && intersects(bbox, currentExtent)) {
      layerIds.push(get(layer, idPath))
    }

    return layerIds
  }, [])
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
    const bbox = get(layer, bboxPath)
    if (bbox && intersects(bbox, currentExtent)) {
      return intersectLayers.concat(layer)
    }

    return intersectLayers
  }, [] as T[])
}
