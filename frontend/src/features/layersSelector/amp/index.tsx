import { AMPLayersList } from './AMPLayersList'
import { toggleMyAmps } from '../../../domain/shared_slices/LayerSidebar'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { ChevronIcon } from '../../commonStyles/icons/ChevronIcon.style'
import { LayerSelectorMenu } from '../utils/LayerSelectorMenu.style'

export function AmpLayers() {
  const dispatch = useAppDispatch()

  const selectedAmpLayerIds = useAppSelector(state => state.selectedAmp.selectedAmpLayerIds)
  const myAmpsIsOpen = useAppSelector(state => state.layerSidebar.myAmpsIsOpen)

  const onTitleClicked = () => {
    dispatch(toggleMyAmps())
  }

  return (
    <>
      <LayerSelectorMenu.Wrapper
        $hasPinnedLayers={selectedAmpLayerIds?.length > 0}
        $isExpanded={myAmpsIsOpen}
        data-cy="amp-layers-my-zones"
        onClick={onTitleClicked}
      >
        <LayerSelectorMenu.Pin />
        <LayerSelectorMenu.Title>Mes AMP</LayerSelectorMenu.Title>
        <ChevronIcon $isOpen={myAmpsIsOpen} $right />
      </LayerSelectorMenu.Wrapper>
      {myAmpsIsOpen && <AMPLayersList />}
    </>
  )
}
