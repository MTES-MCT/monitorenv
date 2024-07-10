import { MonitorEnvLayers, type RegulatoryOrAMPOrViglanceAreaLayerType } from 'domain/entities/layers/constants'

import type { VigilanceArea } from '@features/VigilanceArea/types'
import type { AMPProperties } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompactProperties } from 'domain/entities/regulatory'

export const getTitle = name => (name ? `${name?.replace(/[_]/g, ' ')}` : '')

type GenericLayerType = AMPProperties | RegulatoryLayerCompactProperties | VigilanceArea.VigilanceAreaProperties

const isAMPLayer = (layerType: RegulatoryOrAMPOrViglanceAreaLayerType) =>
  layerType === MonitorEnvLayers.AMP ||
  layerType === MonitorEnvLayers.AMP_PREVIEW ||
  layerType === MonitorEnvLayers.AMP_LINKED_TO_VIGILANCE_AREA

export const getGroupName = (layer: GenericLayerType, layerType: RegulatoryOrAMPOrViglanceAreaLayerType) => {
  if (isAMPLayer(layerType) || layerType === MonitorEnvLayers.VIGILANCE_AREA) {
    return (layer as AMPProperties | VigilanceArea.VigilanceAreaProperties)?.name
  }

  return (layer as RegulatoryLayerCompactProperties).layer_name
}

export const getName = (layer: GenericLayerType, layerType: RegulatoryOrAMPOrViglanceAreaLayerType) => {
  switch (layerType) {
    case MonitorEnvLayers.AMP:
    case MonitorEnvLayers.AMP_PREVIEW:
    case MonitorEnvLayers.AMP_LINKED_TO_VIGILANCE_AREA:
      return (layer as AMPProperties).type

    case MonitorEnvLayers.VIGILANCE_AREA:
      return (layer as VigilanceArea.VigilanceAreaProperties)?.themes?.join(', ')

    default:
      return (layer as RegulatoryLayerCompactProperties).entity_name
  }
}

export const getLegendKey = (layer: GenericLayerType, layerType: RegulatoryOrAMPOrViglanceAreaLayerType) => {
  switch (layerType) {
    case MonitorEnvLayers.AMP:
    case MonitorEnvLayers.AMP_PREVIEW:
    case MonitorEnvLayers.AMP_LINKED_TO_VIGILANCE_AREA:
      return (layer as AMPProperties).name

    case MonitorEnvLayers.VIGILANCE_AREA:
      return (layer as VigilanceArea.VigilanceAreaProperties).comments

    default:
      return (layer as RegulatoryLayerCompactProperties).entity_name
  }
}

export const getLegendType = (layer: GenericLayerType, layerType: RegulatoryOrAMPOrViglanceAreaLayerType) => {
  switch (layerType) {
    case MonitorEnvLayers.AMP:
    case MonitorEnvLayers.AMP_PREVIEW:
    case MonitorEnvLayers.AMP_LINKED_TO_VIGILANCE_AREA:
      return (layer as AMPProperties).type

    case MonitorEnvLayers.VIGILANCE_AREA:
      return (layer as VigilanceArea.VigilanceAreaProperties).name

    default:
      return (layer as RegulatoryLayerCompactProperties).thematique
  }
}
