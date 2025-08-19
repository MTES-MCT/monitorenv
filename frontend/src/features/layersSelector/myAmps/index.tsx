import { InlineTransparentButton } from '@components/style'
import { ChevronIconButton } from '@features/commonStyles/icons/ChevronIconButton'

import { AMPLayersList } from './MyAMPLayersList'
import { layerSidebarActions } from '../../../domain/shared_slices/LayerSidebar'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { closeMetadataPanel } from '../metadataPanel/slice'
import { LayerSelector } from '../utils/LayerSelector.style'

export function AmpLayers() {
  const dispatch = useAppDispatch()

  const selectedAmpLayerIds = useAppSelector(state => state.amp.selectedAmpLayerIds)
  const myAmpsIsOpen = useAppSelector(state => state.layerSidebar.myAmpsIsOpen)

  const onTitleClicked = () => {
    dispatch(layerSidebarActions.toggleMyAmps())
    if (myAmpsIsOpen) {
      dispatch(closeMetadataPanel())
    }
  }

  return (
    <>
      <LayerSelector.Wrapper $hasPinnedLayers={selectedAmpLayerIds?.length > 0} data-cy="my-amp-layers-zones">
        <InlineTransparentButton onClick={onTitleClicked}>
          <LayerSelector.Pin />
          <LayerSelector.Title>Mes AMP</LayerSelector.Title>
        </InlineTransparentButton>
        <ChevronIconButton $isOpen={myAmpsIsOpen} onClick={onTitleClicked} />
      </LayerSelector.Wrapper>
      <AMPLayersList />
    </>
  )
}
