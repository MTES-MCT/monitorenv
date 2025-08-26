import { OPENLAYERS_PROJECTION } from '@mtes-mct/monitor-ui'
import Feature, { type FeatureLike } from 'ol/Feature'
import { GeoJSON } from 'ol/format'

import { type InteractionListener, type InteractionType } from '../entities/map/constants'

import type { Coordinate } from 'ol/coordinate'
import type { Geometry } from 'ol/geom'
import type { Type } from 'ol/geom/Geometry'

export type OverlayItem<T, P> = {
  layerType: T
  properties: P
}
export type MapClickEvent = {
  coordinates: Coordinate | undefined
  ctrlKeyPressed: boolean
  feature: SerializedFeature<Record<string, any>> | undefined
  featureList: SerializedFeature<Record<string, any>>[] | undefined
}

export type InteractionTypeAndListener = {
  listener: InteractionListener
  type: InteractionType
}

export type SerializedFeature<T> = {
  geometry: Geometry & { type?: Type }
  id: string | number
  properties: T
}

const parser = new GeoJSON({ featureProjection: OPENLAYERS_PROJECTION })

export function getGeoJSONFromFeature<P>(feature: Feature<Geometry> | FeatureLike | undefined) {
  if (!feature || !(feature instanceof Feature)) {
    return undefined
  }

  return parser.writeFeatureObject(feature) as SerializedFeature<P>
}

export const getGeoJSONFromFeatureList = (features: (Feature<Geometry> | FeatureLike | undefined)[]) =>
  features.reduce((acc, feature) => {
    const geoJSONFeature = getGeoJSONFromFeature(feature)

    if (geoJSONFeature) {
      acc.push(geoJSONFeature)
    }

    return acc
  }, [] as SerializedFeature<any>[])

export const convertToFeature = <P>(
  serializedFeature: SerializedFeature<P> | undefined
): Feature<Geometry> | undefined => {
  if (!serializedFeature) {
    return undefined
  }

  return parser.readFeature(serializedFeature) as Feature<Geometry>
}
