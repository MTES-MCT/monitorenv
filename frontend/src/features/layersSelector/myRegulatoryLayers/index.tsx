import { RegulatoryLayersList } from './MyRegulatoryLayersList'
import { getSelectedRegulatoryLayers } from '../../../api/regulatoryLayersAPI'
import { toggleMyRegulatoryZones } from '../../../domain/shared_slices/LayerSidebar'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { ChevronIcon } from '../../commonStyles/icons/ChevronIcon.style'
import { LayerSelector } from '../utils/LayerSelector.style'

export function RegulatoryLayers() {
  const dispatch = useAppDispatch()

  const myRegulatoryZonesIsOpen = useAppSelector(state => state.layerSidebar.myRegulatoryZonesIsOpen)

  const selectedRegulatoryLayers = useAppSelector(state => getSelectedRegulatoryLayers(state))

  const onTitleClicked = () => {
    dispatch(toggleMyRegulatoryZones())
  }

  return (
    <>
      <LayerSelector.Wrapper
        $hasPinnedLayers={selectedRegulatoryLayers?.length > 0}
        $isExpanded={myRegulatoryZonesIsOpen}
        data-cy="regulatory-layers-my-zones"
        onClick={onTitleClicked}
      >
        <LayerSelector.Pin />
        <LayerSelector.Title>Mes zones réglementaires</LayerSelector.Title>
        <ChevronIcon $isOpen={myRegulatoryZonesIsOpen} $right />
      </LayerSelector.Wrapper>
      {myRegulatoryZonesIsOpen && <RegulatoryLayersList />}
    </>
  )
}
