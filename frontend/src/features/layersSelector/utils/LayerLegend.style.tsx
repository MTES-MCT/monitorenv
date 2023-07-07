import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { getRegulatoryEnvColorWithAlpha } from '../../map/layers/styles/administrativeAndRegulatoryLayers.style'
import { getAMPColorWithAlpha } from '../../map/layers/styles/AMPLayers.style'

export function RegulatoryLayerLegend({ entity_name, thematique }) {
  const color = getRegulatoryEnvColorWithAlpha(thematique, entity_name)

  return <Rectangle $vectorLayerColor={color} />
}

export function AMPLayerLegend({ name, type }) {
  const color = getAMPColorWithAlpha(type, name)

  return <Rectangle $vectorLayerColor={color} />
}
const Rectangle = styled.div<{ $vectorLayerColor?: string }>`
  width: 14px;
  height: 14px;
  background: ${props => props.$vectorLayerColor || COLORS.gainsboro};
  border: 1px solid ${COLORS.slateGray};
  display: inline-block;
  margin-right: 10px;
  flex-shrink: 0;
`
