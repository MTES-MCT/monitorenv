import styled from 'styled-components'

import { MapComponentStyle } from '../../commonStyles/MapComponent.style'

export const MapToolBox = styled(MapComponentStyle)<{
  $isOpen: boolean
}>`
  background: ${p => p.theme.color.white};
  margin-right: ${p => (p.$isOpen ? '36px' : '-420px')};
  opacity: ${p => (p.$isOpen ? '1' : '0')};
  right: 10px;
  border-radius: 2px;
  position: absolute;
  display: inline-block;
  transition: all 0.5s;
  z-index: 100;
  box-shadow: 0px 3px 10px rgba(59, 69, 89, 0.5);
`
