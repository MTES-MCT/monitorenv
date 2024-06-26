import { Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { MonitorEnvLayers, type RegulatoryOrAMPLayerType } from '../../../domain/entities/layers/constants'
import { getAMPColorWithAlpha } from '../../map/layers/AMP/AMPLayers.style'
import { getRegulatoryEnvColorWithAlpha } from '../../map/layers/styles/administrativeAndRegulatoryLayers.style'

export function LayerLegend({
  layerType,
  legendKey,
  size = Size.SMALL,
  type
}: {
  layerType: RegulatoryOrAMPLayerType
  legendKey?: string | null
  size?: Size
  type?: string | null
}) {
  switch (layerType) {
    case MonitorEnvLayers.AMP:
    case MonitorEnvLayers.AMP_PREVIEW:
      return <Rectangle $size={size} $vectorLayerColor={getAMPColorWithAlpha(type, legendKey)} />
    case MonitorEnvLayers.REGULATORY_ENV:
    case MonitorEnvLayers.REGULATORY_ENV_PREVIEW:
      return <Rectangle $size={size} $vectorLayerColor={getRegulatoryEnvColorWithAlpha(type, legendKey)} />
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
