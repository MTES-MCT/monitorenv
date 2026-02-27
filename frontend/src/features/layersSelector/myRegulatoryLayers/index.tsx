import { getSelectedRegulatoryAreas } from '@api/regulatoryAreasAPI'
import { InlineTransparentButton } from '@components/style'
import { ChevronIconButton } from '@features/commonStyles/icons/ChevronIconButton'

import { RegulatoryLayersList } from './MyRegulatoryLayersList'
import { layerSidebarActions } from '../../../domain/shared_slices/LayerSidebar'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { closeMetadataPanel } from '../metadataPanel/slice'
import { LayerSelector } from '../utils/LayerSelector.style'

export function RegulatoryLayers() {
  const dispatch = useAppDispatch()

  const myRegulatoryZonesIsOpen = useAppSelector(state => state.layerSidebar.myRegulatoryZonesIsOpen)
  const selectedRegulatoryLayers = useAppSelector(state => getSelectedRegulatoryAreas(state))

  const onTitleClicked = () => {
    dispatch(layerSidebarActions.toggleMyRegulatoryZones())
    if (myRegulatoryZonesIsOpen) {
      dispatch(closeMetadataPanel())
    }
  }

  return (
    <>
      <LayerSelector.Wrapper $hasPinnedLayers={selectedRegulatoryLayers?.length > 0} data-cy="my-regulatory-layers">
        <InlineTransparentButton onClick={onTitleClicked}>
          <LayerSelector.Pin />
          <LayerSelector.Title>Mes zones réglementaires</LayerSelector.Title>
        </InlineTransparentButton>
        <ChevronIconButton $isOpen={myRegulatoryZonesIsOpen} onClick={onTitleClicked} />
      </LayerSelector.Wrapper>
      <RegulatoryLayersList />
    </>
  )
}
