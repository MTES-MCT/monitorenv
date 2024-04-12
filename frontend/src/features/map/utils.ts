// selectors taht will be moved to the slice

import { Layers, MonitorEnvLayers } from 'domain/entities/layers/constants'

import type { AMPPRoperties } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompactProperties } from 'domain/entities/regulatory'
import type { MapClickEvent, OverlayItem, SerializedFeature } from 'domain/types/map'

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

    if (type === MonitorEnvLayers.AMP || type === MonitorEnvLayers.REGULATORY_ENV) {
      const { geometry, ...properties } = feature.properties
      acc.push({ layerType: type, properties: properties as AMPPRoperties | RegulatoryLayerCompactProperties })
    }

    return acc
  }, [] as OverlayItem[])

export const getClickedItems = (mapClickEvent: MapClickEvent) => getOverlayItemsFromFeatures(mapClickEvent?.featureList)

export const getHoveredItems = (features: SerializedFeature<Record<string, any>>[] | undefined) =>
  getOverlayItemsFromFeatures(features)
