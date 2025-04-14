import { MultiRadio, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import { BaseLayerLabel } from 'domain/entities/layers/BaseLayer'
import styled from 'styled-components'

import { layerSidebarActions } from '../../../domain/shared_slices/LayerSidebar'
import { selectBaseLayer } from '../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { ChevronIcon } from '../../commonStyles/icons/ChevronIcon.style'
import { LayerSelector } from '../utils/LayerSelector.style'

const baseLayersKeys = getOptionsFromLabelledEnum(BaseLayerLabel)

export function BaseLayerList() {
  const dispatch = useAppDispatch()
  const baselayerIsOpen = useAppSelector(state => state.layerSidebar.baselayerIsOpen)
  const selectedBaseLayer = useAppSelector(state => state.map.selectedBaseLayer)

  const onSectionTitleClicked = () => {
    dispatch(layerSidebarActions.toggleBaseLayer())
  }
  const handleSelectBaseLayer = layercode => {
    dispatch(selectBaseLayer(layercode))
  }

  return (
    <>
      <LayerSelector.Wrapper $isExpanded={baselayerIsOpen} onClick={onSectionTitleClicked}>
        <LayerSelector.Title>Fonds de carte</LayerSelector.Title>
        <ChevronIcon $isOpen={baselayerIsOpen} $right />
      </LayerSelector.Wrapper>
      <BaseLayersContainer $baseLayersLength={baseLayersKeys.length} $showBaseLayers={baselayerIsOpen}>
        <StyledMultiRadio
          isLabelHidden
          label="Fonds de carte"
          name="baseLayer"
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
  border-radius: 0;
  margin: 0;
  height: ${p => (p.$showBaseLayers && p.$baseLayersLength ? 39 * p.$baseLayersLength : 0)}px;
  overflow: hidden;
  transition: 0.5s all;
`

const StyledMultiRadio = styled(MultiRadio)`
  > div > div > div > .rs-radio {
    margin-top: 0px !important;
    padding: 10px 16px;
    width: 100%;

    &:hover {
      background-color: ${p => p.theme.color.blueYonder25};
    }
  }
  > div > div > .Element-Field:not(:last-child) {
    border-bottom: 1px solid ${p => p.theme.color.lightGray};
  }
  > div > div > .Element-Field:not(:first-child) {
    margin: 0px;
  }
`
