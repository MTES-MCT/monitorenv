import { AMPLayersList } from './MyAMPLayersList'
import { toggleMyAmps } from '../../../domain/shared_slices/LayerSidebar'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { ChevronIcon } from '../../commonStyles/icons/ChevronIcon.style'
import { LayerSelector } from '../utils/LayerSelector.style'

export function AmpLayers() {
  const dispatch = useAppDispatch()

  const selectedAmpLayerIds = useAppSelector(state => state.selectedAmp.selectedAmpLayerIds)
  const myAmpsIsOpen = useAppSelector(state => state.layerSidebar.myAmpsIsOpen)

  const onTitleClicked = () => {
    dispatch(toggleMyAmps())
  }

  return (
    <>
      <LayerSelector.Wrapper
        $hasPinnedLayers={selectedAmpLayerIds?.length > 0}
        $isExpanded={myAmpsIsOpen}
        data-cy="my-amp-layers-zones"
        onClick={onTitleClicked}
      >
        <LayerSelector.Pin />
        <LayerSelector.Title>Mes AMP</LayerSelector.Title>
        <ChevronIcon $isOpen={myAmpsIsOpen} $right />
      </LayerSelector.Wrapper>
      {myAmpsIsOpen && <AMPLayersList />}
    </>
  )
}
