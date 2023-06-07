import { Icon } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { toggleMyAmps } from '../../../domain/shared_slices/LayerSidebar'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { ChevronIcon } from '../../commonStyles/icons/ChevronIcon.style'
import { AmpLayersList } from './AmpLayersList'

export function AmpLayers() {
  const dispatch = useDispatch()

  const { myAmpsIsOpen } = useAppSelector(state => state.layerSidebar)
  const onTitleClicked = () => {
    dispatch(toggleMyAmps())
  }

  return (
    <>
      <AmpLayersTitle $showAmpLayers={myAmpsIsOpen} data-cy="amp-layers-my-zones" onClick={onTitleClicked}>
        <Icon.Pin size={18} />
        <Title>Mes AMP</Title>
        <ChevronIcon $isOpen={myAmpsIsOpen} $right />
      </AmpLayersTitle>
      {myAmpsIsOpen && <AmpLayersList />}
    </>
  )
}

const Title = styled.span`
  font-size: 16px;
  line-height: 22px;
`

const AmpLayersTitle = styled.div<{ $showAmpLayers: boolean }>`
  height: 38px;
  padding-top: 8px;
  padding-left: 16px;
  color: ${p => p.theme.color.gainsboro};
  display: flex;
  cursor: pointer;
  text-align: left;
  user-select: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-left-radius: ${props => (props.$showAmpLayers ? '0' : '2px')};
  border-bottom-right-radius: ${props => (props.$showAmpLayers ? '0' : '2px')};
  background: ${p => p.theme.color.charcoal};
`
