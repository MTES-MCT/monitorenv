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

export const StyledLayer = styled(LayerSelector.Layer)<{ $isSelected: boolean; $metadataIsShown: boolean }>`
  background: ${p => (p.$metadataIsShown ? p.theme.color.blueYonder25 : p.theme.color.white)};
  padding-left: 24px;
  padding-right: 24px;
  justify-content: space-between;

  ${p =>
    p.$isSelected &&
    `
        padding-left: 20px;
        padding-right: 20px;
       
    `}
`
