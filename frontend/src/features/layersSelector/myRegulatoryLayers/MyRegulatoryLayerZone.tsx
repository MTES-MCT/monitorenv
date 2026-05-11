import { getRegulatoryAreaTitle } from '@utils/getRegulatoryAreaTitle'
import { getTitle } from 'domain/entities/layers/utils'
import { boundingExtent } from 'ol/extent'

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

import type { RegulatoryArea } from '@features/RegulatoryArea/types'
import type { Coordinate } from 'ol/coordinate'

type RegulatoryLayerZoneProps = {
  regulatoryZone: RegulatoryArea.RegulatoryAreaWithBbox
}
export function RegulatoryLayerZone({ regulatoryZone }: RegulatoryLayerZoneProps) {
  const dispatch = useAppDispatch()
  const showedRegulatoryLayerIds = useAppSelector(state => state.regulatory.showedRegulatoryLayerIds)
  const metadataIsShown = useAppSelector(state => getMetadataIsOpenForRegulatoryLayerId(state, regulatoryZone.id))
  const regulatoryZoneIsShowed = showedRegulatoryLayerIds.includes(regulatoryZone.id)

  const handleRemoveZone = () => dispatch(removeRegulatoryZonesFromMyLayers([regulatoryZone.id]))

  const layerTitle = getRegulatoryAreaTitle(regulatoryZone.polyName, regulatoryZone.resume)

  const displayedName = getTitle(layerTitle) || 'AUCUN NOM'

  const bbox = boundingExtent(regulatoryZone.geom?.coordinates.flat().flat() as Coordinate[])

  const toggleRegulatoryZoneMetadata = () => {
    if (metadataIsShown) {
      dispatch(closeMetadataPanel())
    } else {
      dispatch(openRegulatoryMetadataPanel(regulatoryZone.id))
    }
  }

  return (
    <MyLayerZone
      bbox={bbox}
      displayedName={displayedName}
      hasMetadata={!!layerTitle}
      hideLayer={() => dispatch(hideRegulatoryLayer(regulatoryZone.id))}
      id={regulatoryZone.id}
      isNew={regulatoryZone?.isNew}
      isRecentlyUpdated={regulatoryZone?.isUpdatedRecently}
      layerType={MonitorEnvLayers.REGULATORY_ENV}
      layerZoneIsShowed={regulatoryZoneIsShowed}
      metadataIsShown={metadataIsShown}
      name={layerTitle ?? 'AUCUN NOM'}
      plan={regulatoryZone.plan}
      removeZone={handleRemoveZone}
      showLayer={() => dispatch(showRegulatoryLayer(regulatoryZone.id))}
      toggleZoneMetadata={toggleRegulatoryZoneMetadata}
      type={regulatoryZone.tags?.map(({ name }) => name).join(', ') ?? 'aucun'}
    />
  )
}
