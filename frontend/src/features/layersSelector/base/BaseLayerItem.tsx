import { Radio } from 'rsuite'
import styled from 'styled-components'

import { baseLayers } from '../../../domain/entities/layers/constants'

export function BaseLayerItem({ layer }) {
  return (
    <Row className="base-layers-selection">
      <Radio value={layer}>{baseLayers[layer].text}</Radio>
    </Row>
  )
}

const Row = styled.span`
  width: 100%;
  display: block;
  line-height: 18px;
  padding-left: 20px;
  user-select: none;
`
