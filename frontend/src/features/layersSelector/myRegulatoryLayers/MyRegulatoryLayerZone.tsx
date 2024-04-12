import { MonitorEnvLayers } from '../../../domain/entities/layers/constants'
import {
  hideRegulatoryLayer,
  removeRegulatoryZonesFromMyLayers,
  showRegulatoryLayer
} from '../../../domain/shared_slices/Regulatory'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import {
  closeMetadataPanel,
  getMetadataIsOpenForRegulatoryLayerId,
  openRegulatoryMetadataPanel
} from '../metadataPanel/slice'
import { MyLayerZone } from '../utils/MyLayerZone'

import type { RegulatoryLayerCompact } from 'domain/entities/regulatory'

type RegulatoryLayerZoneProps = {
  regulatoryZone: RegulatoryLayerCompact
}
export function RegulatoryLayerZone({ regulatoryZone }: RegulatoryLayerZoneProps) {
  const dispatch = useAppDispatch()
  const showedRegulatoryLayerIds = useAppSelector(state => state.regulatory.showedRegulatoryLayerIds)
  const metadataIsShown = useAppSelector(state => getMetadataIsOpenForRegulatoryLayerId(state, regulatoryZone.id))
  const regulatoryZoneIsShowed = showedRegulatoryLayerIds.includes(regulatoryZone.id)

  const handleRemoveZone = () => dispatch(removeRegulatoryZonesFromMyLayers([regulatoryZone.id]))

  const displayedName = regulatoryZone?.entity_name?.replace(/[_]/g, ' ') || 'AUNCUN NOM'

  const toggleRegulatoryZoneMetadata = () => {
    if (metadataIsShown) {
      dispatch(closeMetadataPanel())
    } else {
      dispatch(openRegulatoryMetadataPanel(regulatoryZone.id))
    }
  }

  return (
    <MyLayerZone
      bbox={regulatoryZone.bbox}
      displayedName={displayedName}
      hasMetadata={!!regulatoryZone?.entity_name}
      hideLayer={() => dispatch(hideRegulatoryLayer(regulatoryZone.id))}
      layerType={MonitorEnvLayers.REGULATORY_ENV}
      layerZoneIsShowed={regulatoryZoneIsShowed}
      metadataIsShown={metadataIsShown}
      name={regulatoryZone.entity_name}
      removeZone={handleRemoveZone}
      showLayer={() => dispatch(showRegulatoryLayer(regulatoryZone.id))}
      toggleZoneMetadata={toggleRegulatoryZoneMetadata}
      type={regulatoryZone.thematique}
    />
  )
}
