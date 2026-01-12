import { Dashboard } from '@features/Dashboard/types'
import { getLocalizedAreaColorWithAlpha } from '@features/LocalizedArea/utils'
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
  border,
  isDisabled = false,
  layerType,
  legendKey,
  plan = undefined,
  size = Size.SMALL,
  type
}: {
  border?: string
  isDisabled?: boolean
  layerType: RegulatoryOrAMPOrViglanceAreaLayerType | MonitorEnvLayers.LOCALIZED_AREAS
  legendKey?: string
  plan?: string
  size?: Size
  type?: string
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
      return (
        <Rectangle $size={size} $vectorLayerColor={getRegulatoryEnvColorWithAlpha(type, legendKey, plan, isDisabled)} />
      )
    case MonitorEnvLayers.VIGILANCE_AREA:
    case MonitorEnvLayers.VIGILANCE_AREA_PREVIEW:
    case Dashboard.Layer.DASHBOARD_VIGILANCE_AREAS:
      return (
        <Rectangle
          $border={border}
          $size={size}
          $vectorLayerColor={getVigilanceAreaColorWithAlpha(type, legendKey, isDisabled)}
        />
      )
    case MonitorEnvLayers.LOCALIZED_AREAS:
      return <Rectangle $size={size} $vectorLayerColor={getLocalizedAreaColorWithAlpha(type)} />
    default:
      return <Rectangle $size={size} />
  }
}

export const Rectangle = styled.div<{ $border?: string; $size: Size; $vectorLayerColor?: string }>`
  width: ${p => (p.$size === Size.SMALL ? '14px' : '16px')};
  height: ${p => (p.$size === Size.SMALL ? '14px' : '16px')};
  background: ${p => p.$vectorLayerColor ?? p.theme.color.gainsboro};
  border: ${p => p.$border ?? `1px solid ${p.theme.color.slateGray}`};
  display: inline-block;
  flex-shrink: 0;
`
