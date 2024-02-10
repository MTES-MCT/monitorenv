import styled from 'styled-components'

import { getAMPColorWithAlpha } from '../../map/layers/AMP/AMPLayers.style'
import { getRegulatoryEnvColorWithAlpha } from '../../map/layers/styles/administrativeAndRegulatoryLayers.style'

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
  background: ${p => p.$vectorLayerColor ?? p.theme.color.gainsboro};
  border: 1px solid ${p => p.theme.color.slateGray};
  display: inline-block;
  margin-right: 10px;
  flex-shrink: 0;
`
