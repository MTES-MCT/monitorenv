import { MultiRadio, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { BaseLayersLabel } from '../../../domain/entities/layers/constants'
import { toggleBaseLayer } from '../../../domain/shared_slices/LayerSidebar'
import { selectBaseLayer } from '../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { ChevronIcon } from '../../commonStyles/icons/ChevronIcon.style'
import { LayerSelectorMenu } from '../utils/LayerSelectorMenu.style'

const baseLayersKeys = getOptionsFromLabelledEnum(BaseLayersLabel)

export function BaseLayerList() {
  const dispatch = useAppDispatch()
  const baselayerIsOpen = useAppSelector(state => state.layerSidebar.baselayerIsOpen)
  const selectedBaseLayer = useAppSelector(state => state.map.selectedBaseLayer)
  const onSectionTitleClicked = () => {
    dispatch(toggleBaseLayer())
  }
  const handleSelectBaseLayer = layercode => {
    dispatch(selectBaseLayer(layercode))
  }

  return (
    <>
      <LayerSelectorMenu.Wrapper $isExpanded={baselayerIsOpen} onClick={onSectionTitleClicked}>
        <LayerSelectorMenu.Title>Fonds de carte</LayerSelectorMenu.Title>
        <ChevronIcon $isOpen={baselayerIsOpen} $right />
      </LayerSelectorMenu.Wrapper>
      <BaseLayersContainer $baseLayersLength={baseLayersKeys.length} $showBaseLayers={baselayerIsOpen}>
        <StyledMultiRadio
          isLabelHidden
          label="Fonds de carte"
          name="v"
          onChange={handleSelectBaseLayer}
          options={baseLayersKeys}
          value={selectedBaseLayer}
        />
      </BaseLayersContainer>
    </>
  )
}

const BaseLayersContainer = styled.div<{ $baseLayersLength: number | undefined; $showBaseLayers: boolean }>`
  background-color: ${p => p.theme.color.white};
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  border-radius: 0;
  margin: 0;

  animation: ${p => (p.$showBaseLayers ? 'zones-opening' : 'zones-closing')} 0.5s ease forwards;
  height: 0;
  overflow-y: hidden;
  overflow-x: hidden;
  @keyframes zones-opening {
    0% {
      height: 0;
    }
    100% {
      height: ${p => (p.$baseLayersLength ? `${39 * p.$baseLayersLength}px` : '175px')};
    }
  }

  @keyframes zones-closing {
    0% {
      height: ${p => (p.$baseLayersLength ? `${39 * p.$baseLayersLength}px` : '175px')};
    }
    100% {
      height: 0;
    }
  }
`

const StyledMultiRadio = styled(MultiRadio)`
  > div > div > .rs-radio {
    border-bottom: 1px solid ${p => p.theme.color.lightGray};
    margin-top: 0px !important;
    padding: 8px 16px;

    :hover {
      background-color: ${p => p.theme.color.blueYonder25};
    }
    > div > label {
      line-height: 22px;
    }
  }
`
