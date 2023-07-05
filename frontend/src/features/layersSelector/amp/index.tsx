import { useDispatch } from 'react-redux'

import { AMPLayersList } from './AMPLayersList'
import { toggleMyAmps } from '../../../domain/shared_slices/LayerSidebar'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { ChevronIcon } from '../../commonStyles/icons/ChevronIcon.style'
import { LayerSelectorMenu } from '../utils/LayerSelectorMenu.style'

export function AmpLayers() {
  const dispatch = useDispatch()

  const { myAmpsIsOpen } = useAppSelector(state => state.layerSidebar)
  const onTitleClicked = () => {
    dispatch(toggleMyAmps())
  }

  return (
    <>
      <LayerSelectorMenu.Wrapper $isExpanded={myAmpsIsOpen} data-cy="amp-layers-my-zones" onClick={onTitleClicked}>
        <LayerSelectorMenu.Pin />
        <LayerSelectorMenu.Title>Mes AMP</LayerSelectorMenu.Title>
        <ChevronIcon $isOpen={myAmpsIsOpen} $right />
      </LayerSelectorMenu.Wrapper>
      {myAmpsIsOpen && <AMPLayersList />}
    </>
  )
}
