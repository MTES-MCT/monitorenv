import { IconButton, Accent, Size, Icon } from '@mtes-mct/monitor-ui'
import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../domain/entities/map/constants'
import { setFitToExtent } from '../../../../domain/shared_slices/Map'
import {
  hideRegulatoryLayer,
  removeRegulatoryZonesFromMyLayers,
  showRegulatoryLayer
} from '../../../../domain/shared_slices/Regulatory'
import { closeRegulatoryZoneMetadata } from '../../../../domain/use_cases/regulatory/closeRegulatoryZoneMetadata'
import { showRegulatoryZoneMetadata } from '../../../../domain/use_cases/regulatory/showRegulatoryZoneMetadata'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { RegulatoryLayerLegend } from '../../../../ui/RegulatoryLayerLegend'
import { REGULATORY_LAYER_SEARCH_RESULT_ZONE_HEIGHT } from '../../search/RegulatoryLayer'

export function RegulatoryLayerZone({ regulatoryZone }) {
  const dispatch = useDispatch()
  const { showedRegulatoryLayerIds } = useAppSelector(state => state.regulatory)
  const { regulatoryMetadataLayerId, regulatoryMetadataPanelIsOpen } = useAppSelector(state => state.regulatoryMetadata)
  const regulatoryZoneIsShowed = showedRegulatoryLayerIds.includes(regulatoryZone.id)
  const metadataIsShown = regulatoryMetadataPanelIsOpen && regulatoryZone.id === regulatoryMetadataLayerId

  const handleRemoveZone = () => dispatch(removeRegulatoryZonesFromMyLayers([regulatoryZone.id]))
  const zoomToLayerExtent = () => {
    const extent = transformExtent(
      regulatoryZone.bbox,
      new Projection({ code: WSG84_PROJECTION }),
      new Projection({ code: OPENLAYERS_PROJECTION })
    )
    if (!regulatoryZoneIsShowed) {
      dispatch(showRegulatoryLayer(regulatoryZone.id))
    }
    dispatch(setFitToExtent(extent))
  }

  const toggleLayerDisplay = () => {
    if (regulatoryZoneIsShowed) {
      dispatch(hideRegulatoryLayer(regulatoryZone.id))
    } else {
      zoomToLayerExtent()
      dispatch(showRegulatoryLayer(regulatoryZone.id))
    }
  }

  const displayedName = regulatoryZone?.properties?.entity_name?.replace(/[_]/g, ' ') || 'AUNCUN NOM'

  const toggleRegulatoryZoneMetadata = () => {
    if (metadataIsShown) {
      dispatch(closeRegulatoryZoneMetadata())
    } else {
      dispatch(showRegulatoryZoneMetadata(regulatoryZone.id))
    }
  }

  return (
    <Zone $selected={metadataIsShown}>
      <RegulatoryLayerLegend
        entity_name={regulatoryZone?.properties?.entity_name}
        thematique={regulatoryZone?.properties?.thematique}
      />
      <Name title={displayedName}>{displayedName}</Name>
      <Icons>
        <IconButton
          accent={Accent.TERTIARY}
          color={metadataIsShown ? COLORS.blueGray : COLORS.slateGray}
          Icon={Icon.Summary}
          iconSize={20}
          onClick={toggleRegulatoryZoneMetadata}
          size={Size.NORMAL}
          title={metadataIsShown ? 'Fermer la réglementation' : 'Afficher la réglementation'}
        />

        <IconButton
          accent={Accent.TERTIARY}
          color={regulatoryZoneIsShowed ? COLORS.blueGray : COLORS.slateGray}
          data-cy={regulatoryZoneIsShowed ? 'regulatory-my-zones-zone-hide' : 'regulatory-my-zones-zone-show'}
          Icon={Icon.Display}
          iconSize={20}
          onClick={toggleLayerDisplay}
          size={Size.SMALL}
          title={regulatoryZoneIsShowed ? 'Cacher la zone' : 'Afficher la zone'}
        />

        <IconButton
          accent={Accent.TERTIARY}
          data-cy="regulatory-my-zones-zone-delete"
          Icon={Icon.Close}
          onClick={handleRemoveZone}
          size={Size.SMALL}
          title="Supprimer la zone de ma sélection"
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

const Zone = styled.span<{ $selected: boolean }>`
  user-select: none;
  display: flex;
  font-size: 13px;
  padding-left: 20px;
  background: ${props => (props.$selected ? COLORS.gainsboro : COLORS.background)};
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
  > * {
    margin-right: 4px;
    margin-left: 4px;
  }
`
