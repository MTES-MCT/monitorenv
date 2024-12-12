import { Dashboard } from '@features/Dashboard/types'
import { getVigilanceAreaColorWithAlpha } from '@features/VigilanceArea/components/VigilanceAreaLayer/style'
import { Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import {
  MonitorEnvLayers,
  type RegulatoryOrAMPOrViglanceAreaLayerType
} from '../../../domain/entities/layers/constants'
import { getAMPColorWithAlpha } from '../../map/layers/AMP/AMPLayers.style'
import { getRegulatoryEnvColorWithAlpha } from '../../map/layers/styles/administrativeAndRegulatoryLayers.style'

export function LayerLegend({
  isDisabled = false,
  layerType,
  legendKey,
  size = Size.SMALL,
  type
}: {
  isDisabled?: boolean
  layerType: RegulatoryOrAMPOrViglanceAreaLayerType
  legendKey?: string | null
  size?: Size
  type?: string | null
}) {
  switch (layerType) {
    case MonitorEnvLayers.AMP:
    case MonitorEnvLayers.AMP_PREVIEW:
    case MonitorEnvLayers.AMP_LINKED_TO_VIGILANCE_AREA:
    case Dashboard.Layer.DASHBOARD_AMP:
      return <Rectangle $size={size} $vectorLayerColor={getAMPColorWithAlpha(type, legendKey, isDisabled)} />
    case MonitorEnvLayers.REGULATORY_ENV:
    case MonitorEnvLayers.REGULATORY_ENV_PREVIEW:
    case MonitorEnvLayers.REGULATORY_AREAS_LINKED_TO_VIGILANCE_AREA:
    case Dashboard.Layer.DASHBOARD_REGULATORY_AREAS:
      return <Rectangle $size={size} $vectorLayerColor={getRegulatoryEnvColorWithAlpha(type, legendKey, isDisabled)} />
    case MonitorEnvLayers.VIGILANCE_AREA:
    case MonitorEnvLayers.VIGILANCE_AREA_PREVIEW:
    case Dashboard.Layer.DASHBOARD_VIGILANCE_AREAS:
      return <Rectangle $size={size} $vectorLayerColor={getVigilanceAreaColorWithAlpha(type, legendKey, isDisabled)} />
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
  flex-shrink: 0;
`
