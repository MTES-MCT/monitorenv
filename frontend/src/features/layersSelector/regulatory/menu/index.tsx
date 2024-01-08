import { RegulatoryLayersList } from './RegulatoryLayersList'
import { toggleMyRegulatoryZones } from '../../../../domain/shared_slices/LayerSidebar'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { ChevronIcon } from '../../../commonStyles/icons/ChevronIcon.style'
import { LayerSelectorMenu } from '../../utils/LayerSelectorMenu.style'

export function RegulatoryLayers() {
  const dispatch = useAppDispatch()

  const regulatoryLayers = useAppSelector(state => state.regulatory.regulatoryLayers)
  const selectedRegulatoryLayerIds = useAppSelector(state => state.regulatory.selectedRegulatoryLayerIds)
  const myRegulatoryZonesIsOpen = useAppSelector(state => state.layerSidebar.myRegulatoryZonesIsOpen)

  const selectedRegulatoryLayers = regulatoryLayers?.filter(layer => selectedRegulatoryLayerIds.includes(layer.id))

  const onTitleClicked = () => {
    dispatch(toggleMyRegulatoryZones())
  }

  return (
    <>
      <LayerSelectorMenu.Wrapper
        $hasPinnedLayers={selectedRegulatoryLayerIds?.length > 0}
        $isExpanded={myRegulatoryZonesIsOpen}
        data-cy="regulatory-layers-my-zones"
        onClick={onTitleClicked}
      >
        <LayerSelectorMenu.Pin />
        <LayerSelectorMenu.Title>Mes zones réglementaires</LayerSelectorMenu.Title>
        <ChevronIcon $isOpen={myRegulatoryZonesIsOpen} $right />
      </LayerSelectorMenu.Wrapper>
      {myRegulatoryZonesIsOpen && <RegulatoryLayersList results={selectedRegulatoryLayers} />}
    </>
  )
}
