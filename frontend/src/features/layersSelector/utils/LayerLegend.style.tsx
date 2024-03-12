import styled from 'styled-components'

import { MonitorEnvLayers } from '../../../domain/entities/layers/constants'
import { getAMPColorWithAlpha } from '../../map/layers/AMP/AMPLayers.style'
import { getRegulatoryEnvColorWithAlpha } from '../../map/layers/styles/administrativeAndRegulatoryLayers.style'

type LayerTypeEnum = MonitorEnvLayers.AMP | MonitorEnvLayers.REGULATORY_ENV

export function LayerLegend({ layerType, name, type }: { layerType: LayerTypeEnum; name: string; type: string }) {
  switch (layerType) {
    case MonitorEnvLayers.AMP:
      return <Rectangle $vectorLayerColor={getAMPColorWithAlpha(type, name)} />
    case MonitorEnvLayers.REGULATORY_ENV:
      return <Rectangle $vectorLayerColor={getRegulatoryEnvColorWithAlpha(type, name)} />
    default:
      return <Rectangle />
  }
}

const Rectangle = styled.div<{ $vectorLayerColor?: string }>`
  width: 14px;
  height: 14px;
  background: ${p => p.$vectorLayerColor ?? p.theme.color.gainsboro};
  border: 1px solid ${p => p.theme.color.slateGray};
  display: inline-block;
  margin-right: 10px;
  flex-shrink: 0;
`
