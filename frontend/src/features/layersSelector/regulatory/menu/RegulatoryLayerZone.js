import { transformExtent } from 'ol/proj'
import Projection from 'ol/proj/Projection'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled, { css } from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../domain/entities/map'
import { setFitToExtent } from '../../../../domain/shared_slices/Map'
import {
  hideRegulatoryLayer,
  removeRegulatoryZonesFromMyLayers,
  showRegulatoryLayer
} from '../../../../domain/shared_slices/Regulatory'
import { closeRegulatoryZoneMetadata } from '../../../../domain/use_cases/regulatory/closeRegulatoryZoneMetadata'
import showRegulatoryZoneMetadata from '../../../../domain/use_cases/regulatory/showRegulatoryZoneMetadata'
import { CloseIcon } from '../../../commonStyles/icons/CloseIcon.style'
import { HideIcon } from '../../../commonStyles/icons/HideIcon.style'
import { REGPaperDarkIcon, REGPaperIcon } from '../../../commonStyles/icons/REGPaperIcon.style'
import { ShowIcon } from '../../../commonStyles/icons/ShowIcon.style'
import { getRegulatoryEnvColorWithAlpha } from '../../../map/layers/styles/administrativeAndRegulatoryLayers.style'

function RegulatoryLayerZone({ regulatoryZone }) {
  const dispatch = useDispatch()
  const { showedRegulatoryLayerIds } = useSelector(state => state.regulatory)
  const { regulatoryZonesChecked } = useSelector(state => state.regulatoryLayerSearch)
  const { regulatoryMetadataLayerId, regulatoryMetadataPanelIsOpen } = useSelector(state => state.regulatoryMetadata)
  const regulatoryZoneIsShowed = showedRegulatoryLayerIds.includes(regulatoryZone.id)
  const isZoneSelected = regulatoryZonesChecked.includes(regulatoryZone.id)
  const metadataIsShown = regulatoryMetadataPanelIsOpen && regulatoryZone.id === regulatoryMetadataLayerId

  const handleRemoveZone = () => dispatch(removeRegulatoryZonesFromMyLayers([regulatoryZone.id]))
  const zoomToLayerExtent = () => {
    const extent = transformExtent(
      regulatoryZone.bbox,
      new Projection({ code: WSG84_PROJECTION }),
      new Projection({ code: OPENLAYERS_PROJECTION })
    )
    !regulatoryZoneIsShowed && dispatch(showRegulatoryLayer(regulatoryZone.id))
    dispatch(setFitToExtent({ extent }))
  }

  const toggleLayerDisplay = () => {
    if (regulatoryZoneIsShowed) {
      dispatch(hideRegulatoryLayer(regulatoryZone.id))
    } else {
      zoomToLayerExtent()
      dispatch(showRegulatoryLayer(regulatoryZone.id))
    }
  }

  const displayedName = regulatoryZone?.properties?.entity_name.replace(/[_]/g, ' ') || 'AUNCUN NOM'

  const toggleRegulatoryZoneMetadata = () => {
    metadataIsShown ? dispatch(closeRegulatoryZoneMetadata()) : dispatch(showRegulatoryZoneMetadata(regulatoryZone.id))
  }

  return (
    <Zone $selected={isZoneSelected}>
      <Rectangle $vectorLayerColor={getRegulatoryEnvColorWithAlpha(regulatoryZone?.doc?.properties?.thematique)} />
      <Name onClick={toggleLayerDisplay} title={displayedName}>
        {displayedName}
      </Name>
      <Icons>
        {metadataIsShown ? (
          <CustomREGPaperDarkIcon onClick={toggleRegulatoryZoneMetadata} title="Fermer la réglementation" />
        ) : (
          <CustomREGPaperIcon onClick={toggleRegulatoryZoneMetadata} title="Afficher la réglementation" />
        )}
        {regulatoryZoneIsShowed ? (
          <ShowIcon
            data-cy="regulatory-layers-my-zones-zone-hide"
            onClick={toggleLayerDisplay}
            title="Cacher la zone"
          />
        ) : (
          <HideIcon
            data-cy="regulatory-layers-my-zones-zone-show"
            onClick={toggleLayerDisplay}
            title="Afficher la zone"
          />
        )}
        <CloseIcon
          data-cy="regulatory-layers-my-zones-zone-delete"
          onClick={handleRemoveZone}
          title="Supprimer la zone de ma sélection"
        />
      </Icons>
    </Zone>
  )
}

const Name = styled.span`
  width: 280px;
  text-overflow: ellipsis;
  overflow-x: hidden !important;
  font-size: inherit;
  margin-top: 5px;
  text-align: left;
`

const Rectangle = styled.div`
  width: 14px;
  height: 14px;
  background: ${props => props.$vectorLayerColor || COLORS.gray};
  border: 1px solid ${COLORS.grayDarkerTwo};
  display: inline-block;
  margin-right: 10px;
  margin-top: 9px;
  flex-shrink: 0;
`

const Zone = styled.span`
  user-select: none;
  display: flex;
  font-size: 13px;
  padding-left: 20px;
  background: ${props => (props.$selected ? COLORS.gray : COLORS.background)};
  color: ${COLORS.gunMetal};
  padding-top: 1px;
  padding-bottom: 5px;

  :hover {
    background: ${COLORS.shadowBlueLittleOpacity};
  }
`

const CustomPaperStyle = css`
  width: 23px;
  float: right;
  flex-shrink: 0;
  height: 30px;
  cursor: pointer;
`

const CustomREGPaperIcon = styled(REGPaperIcon)`
  ${CustomPaperStyle}
`
const CustomREGPaperDarkIcon = styled(REGPaperDarkIcon)`
  ${CustomPaperStyle}
`

const Icons = styled.span`
  float: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
`

export default RegulatoryLayerZone
