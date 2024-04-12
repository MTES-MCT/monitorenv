import Feature, { type FeatureLike } from 'ol/Feature'
import { GeoJSON } from 'ol/format'

import { OPENLAYERS_PROJECTION, type InteractionListener, type InteractionType } from '../entities/map/constants'

import type { AMPPRoperties } from 'domain/entities/AMPs'
import type { MonitorEnvLayers } from 'domain/entities/layers/constants'
import type { RegulatoryLayerCompactProperties } from 'domain/entities/regulatory'
import type { Coordinate } from 'ol/coordinate'
import type { Geometry } from 'ol/geom'

export type OverlayItem = {
  layerType: MonitorEnvLayers.AMP | MonitorEnvLayers.REGULATORY_ENV
  properties: AMPPRoperties | RegulatoryLayerCompactProperties
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

export type SerializedFeature<P> = {
  geometry: Geometry
  id: string | number
  properties: P
}

export const convertToSerializedFeature = <P>(
  feature: Feature<Geometry> | undefined
): SerializedFeature<P> | undefined => {
  if (!feature) {
    return undefined
  }
  const geometry = feature.getGeometry()
  if (!geometry) {
    return undefined
  }

  return {
    geometry,
    id: feature.getId() as string | number,
    properties: feature.getProperties() as P
  }
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
  const feature = parser.readFeature(serializedFeature)

  return feature
}
