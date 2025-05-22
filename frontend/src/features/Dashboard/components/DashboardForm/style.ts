import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import styled from 'styled-components'

export const SelectedLayerList = styled.ul`
  margin: 0 4px;
  padding: 0;
  max-height: 100%;
  color: ${p => p.theme.color.slateGray};
`

export const ResultNumber = styled.small`
  font-size: 13px;
  font-weight: normal;
  color: ${p => p.theme.color.slateGray};
`

export const StyledLayerList = styled(LayerSelector.LayerList)`
  overflow: hidden;
  height: auto;
  max-height: 100%;
`
