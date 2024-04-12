import { MonitorEnvLayers } from 'domain/entities/layers/constants'

import type { AMPPRoperties } from 'domain/entities/AMPs'
import type { RegulatoryLayerCompactProperties } from 'domain/entities/regulatory'

export const getName = (
  layer: AMPPRoperties | RegulatoryLayerCompactProperties,
  layerType: MonitorEnvLayers.AMP | MonitorEnvLayers.REGULATORY_ENV
) => {
  if (layerType === MonitorEnvLayers.AMP) {
    return (layer as AMPPRoperties).name
  }

  return (layer as RegulatoryLayerCompactProperties).entity_name
}

export const getType = (
  layer: AMPPRoperties | RegulatoryLayerCompactProperties,
  layerType: MonitorEnvLayers.AMP | MonitorEnvLayers.REGULATORY_ENV
) => {
  if (layerType === MonitorEnvLayers.AMP) {
    return (layer as AMPPRoperties).type
  }

  return (layer as RegulatoryLayerCompactProperties).thematique
}
