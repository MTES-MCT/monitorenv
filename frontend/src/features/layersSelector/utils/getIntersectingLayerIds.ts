import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { get } from 'lodash'
import { type Extent, intersects } from 'ol/extent'
import { transformExtent } from 'ol/proj'

const cache = new Map<string, number[]>()
const MAX_CACHE_SIZE = 50

function normalizeExtent(extent: Extent | undefined) {
  if (!extent) {
    return 'no-extent'
  }

  return extent.map(v => v.toFixed(4)).join(',')
}

function normalizeLayerIds<T>(layers: T[], idPath: string) {
  return layers
    .map(layer => get(layer, idPath))
    .sort((a, b) => a - b)
    .join(',')
}

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
    return layers.map(layer => get(layer, idPath))
  }

  const extentKey = normalizeExtent(extent)
  const layersKey = normalizeLayerIds(layers, idPath)

  const cacheKey = `${shouldFilter}|${bboxPath}|${idPath}|${extentKey}|${layersKey}`

  const cached = cache.get(cacheKey)

  if (cached) {
    return cached
  }

  const currentExtent = transformExtent(extent, OPENLAYERS_PROJECTION, WSG84_PROJECTION)

  const result = layers.reduce<number[]>((layerIds, layer) => {
    const bbox = get(layer, bboxPath)
    if (bbox && intersects(bbox, currentExtent)) {
      layerIds.push(get(layer, idPath))
    }

    return layerIds
  }, [])

  cache.set(cacheKey, result)

  if (cache.size > MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value as string
    cache.delete(firstKey)
  }

  return result
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
