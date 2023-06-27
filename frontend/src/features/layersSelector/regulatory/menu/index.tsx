import { useDispatch } from 'react-redux'

import { toggleMyRegulatoryZones } from '../../../../domain/shared_slices/LayerSidebar'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { ChevronIcon } from '../../../commonStyles/icons/ChevronIcon.style'
import { LayerType } from '../../utils/LayerType.style'
import { RegulatoryLayersList } from './RegulatoryLayersList'

export function RegulatoryLayers() {
  const dispatch = useDispatch()

  const { regulatoryLayers, selectedRegulatoryLayerIds } = useAppSelector(state => state.regulatory)
  const { myRegulatoryZonesIsOpen } = useAppSelector(state => state.layerSidebar)

  const selectedRegulatoryLayers = regulatoryLayers?.filter(layer => selectedRegulatoryLayerIds.includes(layer.id))

  const onTitleClicked = () => {
    dispatch(toggleMyRegulatoryZones())
  }

  return (
    <>
      <LayerType.Wrapper
        $isExpanded={myRegulatoryZonesIsOpen}
        data-cy="regulatory-layers-my-zones"
        onClick={onTitleClicked}
      >
        <LayerType.Pin />
        <LayerType.Title>Mes zones réglementaires</LayerType.Title>
        <ChevronIcon $isOpen={myRegulatoryZonesIsOpen} $right />
      </LayerType.Wrapper>
      {myRegulatoryZonesIsOpen && <RegulatoryLayersList results={selectedRegulatoryLayers} />}
    </>
  )
}
