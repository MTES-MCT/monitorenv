import { MonitorEnvLayers, type RegulatoryOrAMPLayerType } from 'domain/entities/layers/constants'

import type { AMPProperties } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompactProperties } from 'domain/entities/regulatory'

export const getName = (
  layer: AMPProperties | RegulatoryLayerCompactProperties,
  layerType: RegulatoryOrAMPLayerType
) => {
  if (layerType === MonitorEnvLayers.AMP || layerType === MonitorEnvLayers.AMP_PREVIEW) {
    return (layer as AMPProperties).name
  }

  return (layer as RegulatoryLayerCompactProperties).entity_name
}

export const getType = (
  layer: AMPProperties | RegulatoryLayerCompactProperties,
  layerType: RegulatoryOrAMPLayerType
) => {
  if (layerType === MonitorEnvLayers.AMP || layerType === MonitorEnvLayers.AMP_PREVIEW) {
    return (layer as AMPProperties).type
  }

  return (layer as RegulatoryLayerCompactProperties).thematique
}
