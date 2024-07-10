import { MonitorEnvLayers, type RegulatoryOrAMPOrViglanceAreaLayerType } from 'domain/entities/layers/constants'

import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { AMPProperties } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompactProperties } from 'domain/entities/regulatory'

export const getTitle = name => (name ? `${name?.replace(/[_]/g, ' ')}` : '')

type GenericLayerType = AMPProperties | RegulatoryLayerCompactProperties | VigilanceArea.VigilanceAreaProperties

export const getGroupName = (layer: GenericLayerType, layerType: RegulatoryOrAMPOrViglanceAreaLayerType) => {
  if (
    layerType === MonitorEnvLayers.AMP ||
    layerType === MonitorEnvLayers.AMP_PREVIEW ||
    layerType === MonitorEnvLayers.VIGILANCE_AREA
  ) {
    return (layer as AMPProperties | VigilanceArea.VigilanceAreaProperties)?.name
  }

  return (layer as RegulatoryLayerCompactProperties).layer_name
}

export const getName = (layer: GenericLayerType, layerType: RegulatoryOrAMPOrViglanceAreaLayerType) => {
  if (layerType === MonitorEnvLayers.AMP || layerType === MonitorEnvLayers.AMP_PREVIEW) {
    return (layer as AMPProperties).type
  }

  if (layerType === MonitorEnvLayers.VIGILANCE_AREA) {
    return (layer as VigilanceArea.VigilanceAreaProperties)?.themes?.join(', ')
  }

  return (layer as RegulatoryLayerCompactProperties).entity_name
}

export const getLegendKey = (layer: GenericLayerType, layerType: RegulatoryOrAMPOrViglanceAreaLayerType) => {
  if (layerType === MonitorEnvLayers.AMP || layerType === MonitorEnvLayers.AMP_PREVIEW) {
    return (layer as AMPProperties).name
  }
  if (layerType === MonitorEnvLayers.VIGILANCE_AREA) {
    return (layer as VigilanceArea.VigilanceAreaProperties).comments
  }

  return (layer as RegulatoryLayerCompactProperties).entity_name
}

export const getLegendType = (layer: GenericLayerType, layerType: RegulatoryOrAMPOrViglanceAreaLayerType) => {
  if (layerType === MonitorEnvLayers.AMP || layerType === MonitorEnvLayers.AMP_PREVIEW) {
    return (layer as AMPProperties).type
  }
  if (layerType === MonitorEnvLayers.VIGILANCE_AREA) {
    return (layer as VigilanceArea.VigilanceAreaProperties).name
  }

  return (layer as RegulatoryLayerCompactProperties).thematique
}
