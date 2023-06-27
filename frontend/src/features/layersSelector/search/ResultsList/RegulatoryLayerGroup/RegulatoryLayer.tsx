import { Accent, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import Highlighter from 'react-highlight-words'
import { useDispatch } from 'react-redux'

import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../../../domain/shared_slices/Map'
import {
  addRegulatoryZonesToMyLayers,
  removeRegulatoryZonesFromMyLayers
} from '../../../../../domain/shared_slices/Regulatory'
import { closeRegulatoryZoneMetadata } from '../../../../../domain/use_cases/regulatory/closeRegulatoryZoneMetadata'
import { showRegulatoryZoneMetadata } from '../../../../../domain/use_cases/regulatory/showRegulatoryZoneMetadata'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { RegulatoryLayerLegend } from '../../../../../ui/RegulatoryLayerLegend'
import { LayerSelector } from '../../../utils/LayerSelector.style'

export function RegulatoryLayer({ layerId, searchedText }: { layerId: number; searchedText: string }) {
  const dispatch = useDispatch()
  const {
    regulatoryLayersById: { [layerId]: layer },
    selectedRegulatoryLayerIds
  } = useAppSelector(state => state.regulatory)
  const { regulatoryMetadataLayerId, regulatoryMetadataPanelIsOpen } = useAppSelector(state => state.regulatoryMetadata)
  const isZoneSelected = selectedRegulatoryLayerIds.includes(layerId)
  const metadataIsShown = regulatoryMetadataPanelIsOpen && layerId === regulatoryMetadataLayerId

  const handleSelectRegulatoryZone = e => {
    e.stopPropagation()
    if (isZoneSelected) {
      dispatch(removeRegulatoryZonesFromMyLayers([layerId]))
    } else {
      dispatch(addRegulatoryZonesToMyLayers([layerId]))
    }
  }

  const toggleRegulatoryZoneMetadata = () => {
    if (metadataIsShown) {
      dispatch(closeRegulatoryZoneMetadata())
    } else {
      dispatch(showRegulatoryZoneMetadata(layerId))
    }
  }

  const fitToRegulatoryLayer = () => {
    if (!layer?.bbox) {
      return
    }
    const extent = transformExtent(
      layer?.bbox,
      new Projection({ code: WSG84_PROJECTION }),
      new Projection({ code: OPENLAYERS_PROJECTION })
    )
    dispatch(setFitToExtent(extent))
  }

  return (
    <LayerSelector.Layer $metadataIsShown={metadataIsShown} onClick={toggleRegulatoryZoneMetadata}>
      <RegulatoryLayerLegend entity_name={layer?.properties?.entity_name} thematique={layer?.properties?.thematique} />
      <LayerSelector.LayerName onClick={fitToRegulatoryLayer} title={layer?.properties?.entity_name}>
        <Highlighter
          autoEscape
          highlightClassName="highlight"
          searchWords={searchedText && searchedText.length > 0 ? searchedText.split(' ') : []}
          textToHighlight={layer?.properties?.entity_name || ''}
        />
        {!layer?.properties?.entity_name && 'AUCUN NOM'}
      </LayerSelector.LayerName>
      <LayerSelector.IconGroup>
        <IconButton
          accent={Accent.TERTIARY}
          data-cy="regulatory-zone-check"
          Icon={isZoneSelected ? Icon.PinFilled : Icon.Pin}
          onClick={handleSelectRegulatoryZone}
          size={Size.NORMAL}
        />
      </LayerSelector.IconGroup>
    </LayerSelector.Layer>
  )
}
