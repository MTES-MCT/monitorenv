import styled from 'styled-components'

import { COLORS } from '../constants/constants'
import { getRegulatoryEnvColorWithAlpha } from '../features/map/layers/styles/administrativeAndRegulatoryLayers.style'

export function RegulatoryLayerLegend({ entity_name, thematique }) {
  const color = getRegulatoryEnvColorWithAlpha(thematique, entity_name)

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
