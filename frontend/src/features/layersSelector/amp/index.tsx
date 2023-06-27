import { useDispatch } from 'react-redux'

import { toggleMyAmps } from '../../../domain/shared_slices/LayerSidebar'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { ChevronIcon } from '../../commonStyles/icons/ChevronIcon.style'
import { LayerType } from '../utils/LayerType.style'
import { AMPLayersList } from './AMPLayersList'

export function AmpLayers() {
  const dispatch = useDispatch()

  const { myAmpsIsOpen } = useAppSelector(state => state.layerSidebar)
  const onTitleClicked = () => {
    dispatch(toggleMyAmps())
  }

  return (
    <>
      <LayerType.Wrapper $isExpanded={myAmpsIsOpen} data-cy="amp-layers-my-zones" onClick={onTitleClicked}>
        <LayerType.Pin />
        <LayerType.Title>Mes AMP</LayerType.Title>
        <ChevronIcon $isOpen={myAmpsIsOpen} $right />
      </LayerType.Wrapper>
      {myAmpsIsOpen && <AMPLayersList />}
    </>
  )
}
