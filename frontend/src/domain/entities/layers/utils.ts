import { Dashboard } from '@features/Dashboard/types'
import { displayTags } from '@utils/getTagsAsOptions'
import { MonitorEnvLayers, type RegulatoryOrAMPOrViglanceAreaLayerType } from 'domain/entities/layers/constants'

import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { AMPProperties } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompactProperties } from 'domain/entities/regulatory'

export const getTitle = (name?: string | undefined) => (name ? `${name?.replace(/[_]/g, ' ')}` : '')

type GenericLayerType = AMPProperties | RegulatoryLayerCompactProperties | VigilanceArea.VigilanceAreaProperties

const isAMPLayer = (layerType: RegulatoryOrAMPOrViglanceAreaLayerType) =>
  layerType === MonitorEnvLayers.AMP ||
  layerType === MonitorEnvLayers.AMP_PREVIEW ||
  layerType === MonitorEnvLayers.AMP_LINKED_TO_VIGILANCE_AREA ||
  layerType === Dashboard.Layer.DASHBOARD_AMP

export const getGroupName = (layer: GenericLayerType, layerType: RegulatoryOrAMPOrViglanceAreaLayerType) => {
  if (
    isAMPLayer(layerType) ||
    layerType === MonitorEnvLayers.VIGILANCE_AREA ||
    layerType === MonitorEnvLayers.VIGILANCE_AREA_PREVIEW ||
    layerType === Dashboard.Layer.DASHBOARD_VIGILANCE_AREAS
  ) {
    return (layer as AMPProperties | VigilanceArea.VigilanceAreaProperties)?.name
  }

  return (layer as RegulatoryLayerCompactProperties).layerName
}

export const getName = (layer: GenericLayerType, layerType: RegulatoryOrAMPOrViglanceAreaLayerType) => {
  switch (layerType) {
    case MonitorEnvLayers.AMP:
    case MonitorEnvLayers.AMP_PREVIEW:
    case MonitorEnvLayers.AMP_LINKED_TO_VIGILANCE_AREA:
    case Dashboard.Layer.DASHBOARD_AMP:
      return (layer as AMPProperties).type

    case MonitorEnvLayers.VIGILANCE_AREA:
    case MonitorEnvLayers.VIGILANCE_AREA_PREVIEW:
    case Dashboard.Layer.DASHBOARD_VIGILANCE_AREAS:
      return displayTags((layer as VigilanceArea.VigilanceAreaProperties)?.tags)

    default:
      return (layer as RegulatoryLayerCompactProperties).entityName
  }
}

export const getLegendKey = (layer: GenericLayerType, layerType: RegulatoryOrAMPOrViglanceAreaLayerType) => {
  switch (layerType) {
    case MonitorEnvLayers.AMP:
    case MonitorEnvLayers.AMP_PREVIEW:
    case MonitorEnvLayers.AMP_LINKED_TO_VIGILANCE_AREA:
    case Dashboard.Layer.DASHBOARD_AMP:
      return (layer as AMPProperties).name

    case MonitorEnvLayers.VIGILANCE_AREA:
    case MonitorEnvLayers.VIGILANCE_AREA_PREVIEW:
    case Dashboard.Layer.DASHBOARD_VIGILANCE_AREAS:
      return (layer as VigilanceArea.VigilanceAreaProperties).comments

    default:
      return (layer as RegulatoryLayerCompactProperties).entityName
  }
}

export const getLegendType = (layer: GenericLayerType, layerType: RegulatoryOrAMPOrViglanceAreaLayerType) => {
  switch (layerType) {
    case MonitorEnvLayers.AMP:
    case MonitorEnvLayers.AMP_PREVIEW:
    case MonitorEnvLayers.AMP_LINKED_TO_VIGILANCE_AREA:
    case Dashboard.Layer.DASHBOARD_AMP:
      return (layer as AMPProperties).type

    case MonitorEnvLayers.VIGILANCE_AREA:
    case MonitorEnvLayers.VIGILANCE_AREA_PREVIEW:
    case Dashboard.Layer.DASHBOARD_VIGILANCE_AREAS:
      return (layer as VigilanceArea.VigilanceAreaProperties).name

    default:
      return displayTags((layer as RegulatoryLayerCompactProperties).tags)
  }
}
