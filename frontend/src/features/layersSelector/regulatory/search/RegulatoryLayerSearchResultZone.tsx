import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import Highlighter from 'react-highlight-words'
import { useDispatch } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../domain/entities/map'
import { setFitToExtent } from '../../../../domain/shared_slices/Map'
import {
  addRegulatoryZonesToMyLayers,
  removeRegulatoryZonesFromMyLayers
} from '../../../../domain/shared_slices/Regulatory'
import { closeRegulatoryZoneMetadata } from '../../../../domain/use_cases/regulatory/closeRegulatoryZoneMetadata'
import { showRegulatoryZoneMetadata } from '../../../../domain/use_cases/regulatory/showRegulatoryZoneMetadata'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { RegulatoryLayerLegend } from '../../../../ui/RegulatoryLayerLegend'
import { ReactComponent as PinSVG } from '../../../../uiMonitor/icons/Pin.svg'
import { ReactComponent as PinFullSVG } from '../../../../uiMonitor/icons/Pin_filled.svg'

export const REGULATORY_LAYER_SEARCH_RESULT_ZONE_HEIGHT = 36

export function RegulatoryLayerSearchResultZone({ regulatoryZone, searchedText }) {
  const dispatch = useDispatch()
  const { selectedRegulatoryLayerIds } = useAppSelector(state => state.regulatory)
  const { regulatoryMetadataLayerId, regulatoryMetadataPanelIsOpen } = useAppSelector(state => state.regulatoryMetadata)
  const isZoneSelected = selectedRegulatoryLayerIds.includes(regulatoryZone.id)
  const metadataIsShown = regulatoryMetadataPanelIsOpen && regulatoryZone.id === regulatoryMetadataLayerId

  const handleSelectRegulatoryZone = e => {
    e.stopPropagation()
    if (isZoneSelected) {
      dispatch(removeRegulatoryZonesFromMyLayers([regulatoryZone.id]))
    } else {
      dispatch(addRegulatoryZonesToMyLayers([regulatoryZone.id]))
    }
  }

  const toggleRegulatoryZoneMetadata = () => {
    if (metadataIsShown) {
      dispatch(closeRegulatoryZoneMetadata())
    } else {
      dispatch(showRegulatoryZoneMetadata(regulatoryZone.id))
    }
  }

  const fitToRegulatoryLayer = () => {
    const extent = transformExtent(
      regulatoryZone?.doc?.bbox,
      new Projection({ code: WSG84_PROJECTION }),
      new Projection({ code: OPENLAYERS_PROJECTION })
    )
    dispatch(setFitToExtent(extent))
  }

  return (
    <Zone $metadataIsShown={metadataIsShown} onClick={toggleRegulatoryZoneMetadata}>
      <RegulatoryLayerLegend
        entity_name={regulatoryZone?.doc?.properties?.entity_name}
        thematique={regulatoryZone?.doc?.properties?.thematique}
      />
      <Name onClick={fitToRegulatoryLayer} title={regulatoryZone?.doc?.properties?.entity_name}>
        <Highlighter
          autoEscape
          highlightClassName="highlight"
          searchWords={searchedText && searchedText.length > 0 ? searchedText.split(' ') : []}
          textToHighlight={regulatoryZone?.doc?.properties?.entity_name || ''}
        />
        {!regulatoryZone?.doc?.properties?.entity_name && 'AUCUN NOM'}
      </Name>
      <Icons>
        <IconButton
          appearance="subtle"
          data-cy="regulatory-zone-check"
          icon={isZoneSelected ? <PinFullSVGIcon className="rs-icon" /> : <PinSVGIcon className="rs-icon" />}
          onClick={handleSelectRegulatoryZone}
          size="md"
        />
      </Icons>
    </Zone>
  )
}

const Name = styled.span`
  width: 280px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden !important;
  font-size: inherit;
  text-align: left;
  span {
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const Zone = styled.span<{ $metadataIsShown: boolean }>`
  user-select: none;
  display: flex;
  text-align: left;
  font-size: 13px;
  padding-left: 20px;
  background: ${props => (props.$metadataIsShown ? COLORS.blueYonder25 : COLORS.white)};
  color: ${COLORS.gunMetal};
  height: ${REGULATORY_LAYER_SEARCH_RESULT_ZONE_HEIGHT}px;
  align-items: center;

  :hover {
    background: ${COLORS.blueYonder25};
  }
`

const Icons = styled.span`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 0;
  margin-right: 4px;
`

const PinSVGIcon = styled(PinSVG)`
  color: ${COLORS.slateGray};
  :hover,
  :focus,
  :active {
    color: ${COLORS.blueYonder};
  }
`
const PinFullSVGIcon = styled(PinFullSVG)`
  color: ${COLORS.blueGray};
  :hover,
  :focus,
  :active {
    color: ${COLORS.blueYonder};
  }
`
