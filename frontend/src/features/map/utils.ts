// selectors taht will be moved to the slice

import {
  MonitorEnvLayers,
  type RegulatoryOrAMPOrViglanceAreaLayerType,
  RegulatoryOrAMPOrViglanceAreaLayerTypeAsList
} from 'domain/entities/layers/constants'
import { uniqBy } from 'lodash-es'

import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { AMPProperties } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompactProperties } from 'domain/entities/regulatory'
import type { OverlayItem, SerializedFeature } from 'domain/types/map'
import type { FeatureLike } from 'ol/Feature'

type GetClickedFeatureType = {
  featureList: SerializedFeature<Record<string, any>>[] | undefined
  isRegulatoryOrAmp: boolean
  typesList: string[]
}
export const getClickedFeatures = ({
  featureList,
  isRegulatoryOrAmp,
  typesList
}: GetClickedFeatureType): SerializedFeature<Record<string, any>>[] | undefined =>
  featureList?.filter(feature => {
    const featureId = isRegulatoryOrAmp ? String(feature.id) : String(feature.id).split(':')[0]

    return featureId && typesList.some(type => featureId.includes(type))
  })

export const getOverlayItemsFromFeatures = (
  features: SerializedFeature<Record<string, any>>[] | undefined,
  isLinkingZonesToVigilanceArea: boolean
) =>
  features?.reduce((acc, feature) => {
    const type = String(feature.id).split(':')[0]

    if (
      RegulatoryOrAMPOrViglanceAreaLayerTypeAsList.includes(type as MonitorEnvLayers) &&
      ((isLinkingZonesToVigilanceArea &&
        type !== MonitorEnvLayers.VIGILANCE_AREA &&
        type !== MonitorEnvLayers.VIGILANCE_AREA_PREVIEW) ||
        !isLinkingZonesToVigilanceArea)
    ) {
      const { properties } = feature

      acc.push({
        layerType: type as RegulatoryOrAMPOrViglanceAreaLayerType,
        properties: properties as
          | AMPProperties
          | RegulatoryLayerCompactProperties
          | VigilanceArea.VigilanceAreaProperties
      })
    }

    return acc
  }, [] as OverlayItem<RegulatoryOrAMPOrViglanceAreaLayerType, AMPProperties | RegulatoryLayerCompactProperties | VigilanceArea.VigilanceAreaProperties>[])

export const getClickedItems = (
  isLinkingZonesToVigilanceArea: boolean,
  featureList: SerializedFeature<Record<string, any>>[] | undefined
) => getOverlayItemsFromFeatures(featureList, isLinkingZonesToVigilanceArea)

export const getHoveredItems = (
  features: SerializedFeature<Record<string, any>>[] | undefined,
  isLinkingZonesToVigilanceArea: boolean
) => getOverlayItemsFromFeatures(features, isLinkingZonesToVigilanceArea)

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

  return uniqBy(highestPriorityFeatures, feature => String(feature.getId()).split(':')[1])
}
