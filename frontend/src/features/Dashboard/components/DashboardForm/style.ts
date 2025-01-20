import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import styled from 'styled-components'

export const SelectedLayerList = styled.ul`
  margin: 0px 4px;
  padding: 0;
  max-height: 100%;
  color: ${p => p.theme.color.slateGray};
`

export const StyledLayerList = styled(LayerSelector.LayerList)`
  overflow: hidden;
  height: auto;
  max-height: 100%;
`
