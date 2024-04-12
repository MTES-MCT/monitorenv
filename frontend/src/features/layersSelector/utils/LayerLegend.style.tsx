import { Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { MonitorEnvLayers } from '../../../domain/entities/layers/constants'
import { getAMPColorWithAlpha } from '../../map/layers/AMP/AMPLayers.style'
import { getRegulatoryEnvColorWithAlpha } from '../../map/layers/styles/administrativeAndRegulatoryLayers.style'

type LayerTypeEnum = MonitorEnvLayers.AMP | MonitorEnvLayers.REGULATORY_ENV

export function LayerLegend({
  layerType,
  name,
  size = Size.SMALL,
  type
}: {
  layerType: LayerTypeEnum
  name: string | null
  size?: Size
  type: string | null
}) {
  switch (layerType) {
    case MonitorEnvLayers.AMP:
      return <Rectangle $size={size} $vectorLayerColor={getAMPColorWithAlpha(type, name)} />
    case MonitorEnvLayers.REGULATORY_ENV:
      return <Rectangle $size={size} $vectorLayerColor={getRegulatoryEnvColorWithAlpha(type, name)} />
    default:
      return <Rectangle $size={size} />
  }
}

const Rectangle = styled.div<{ $size: Size; $vectorLayerColor?: string }>`
  width: ${p => (p.$size === Size.SMALL ? '14px' : '16px')};
  height: ${p => (p.$size === Size.SMALL ? '14px' : '16px')};
  background: ${p => p.$vectorLayerColor ?? p.theme.color.gainsboro};
  border: 1px solid ${p => p.theme.color.slateGray};
  display: inline-block;
  margin-right: 10px;
  flex-shrink: 0;
`
