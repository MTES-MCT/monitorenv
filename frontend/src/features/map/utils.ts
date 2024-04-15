// selectors taht will be moved to the slice

import {
  Layers,
  MonitorEnvLayers,
  type RegulatoryOrAMPLayerType,
  RegulatoryOrAMPLayerTypeAsList
} from 'domain/entities/layers/constants'

import type { AMPProperties } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompactProperties } from 'domain/entities/regulatory'
import type { MapClickEvent, OverlayItem, SerializedFeature } from 'domain/types/map'
import type { FeatureLike } from 'ol/Feature'

export const getClickedRegulatoryFeatures = (mapClickEvent: MapClickEvent) =>
  mapClickEvent.featureList?.filter(feature => {
    const featureId = String(feature.id)

    return (
      featureId &&
      (featureId.includes(Layers.REGULATORY_ENV_PREVIEW.code) || featureId.includes(Layers.REGULATORY_ENV.code))
    )
  })

export const getClickedAmpFeatures = (mapClickEvent: MapClickEvent) =>
  mapClickEvent.featureList?.filter(feature => {
    const featureId = String(feature.id)

    return featureId && (featureId.includes(Layers.AMP_PREVIEW.code) || featureId.includes(Layers.AMP.code))
  })
export const getOverlayItemsFromFeatures = (features: SerializedFeature<Record<string, any>>[] | undefined) =>
  features?.reduce((acc, feature) => {
    const type = String(feature.id).split(':')[0]

    if (RegulatoryOrAMPLayerTypeAsList.includes(type as MonitorEnvLayers)) {
      const { geometry, ...properties } = feature.properties
      acc.push({
        layerType: type as RegulatoryOrAMPLayerType,
        properties: properties as AMPProperties | RegulatoryLayerCompactProperties
      })
    }

    return acc
  }, [] as OverlayItem<RegulatoryOrAMPLayerType, AMPProperties | RegulatoryLayerCompactProperties>[])

export const getClickedItems = (mapClickEvent: MapClickEvent) => getOverlayItemsFromFeatures(mapClickEvent?.featureList)

export const getHoveredItems = (features: SerializedFeature<Record<string, any>>[] | undefined) =>
  getOverlayItemsFromFeatures(features)

export const getHighestPriorityFeatures = (features: FeatureLike[], priorityOrderTypes: Array<MonitorEnvLayers[]>) => {
  const highestPriorityFeatureTypes = priorityOrderTypes.find(layerTypes =>
    features.some(feature => layerTypes.some(layerType => String(feature.getId()).includes(layerType)))
  )
  if (!highestPriorityFeatureTypes) {
    return []
  }
  const highestPriorityFeatures = features.filter(feature =>
    highestPriorityFeatureTypes.some(highestPriorityFeatureType =>
      String(feature.getId()).includes(highestPriorityFeatureType)
    )
  )

  return highestPriorityFeatures
}
