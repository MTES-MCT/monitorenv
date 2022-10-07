import React from 'react'
import Highlighter from 'react-highlight-words'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton } from 'rsuite'
import styled, { css } from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import {
  setRegulatoryGeometriesToPreview,
  addRegulatoryZonesToMyLayers,
  removeRegulatoryZonesFromMyLayers
} from '../../../../domain/shared_slices/Regulatory'
import { closeRegulatoryZoneMetadata } from '../../../../domain/use_cases/regulatory/closeRegulatoryZoneMetadata'
import { showRegulatoryZoneMetadata } from '../../../../domain/use_cases/regulatory/showRegulatoryZoneMetadata'
import { ReactComponent as PinSVG } from '../../../../uiMonitor/icons/Pin.svg'
import { ReactComponent as PinFullSVG } from '../../../../uiMonitor/icons/Pin_filled.svg'
import { ReactComponent as SummarySVG } from '../../../../uiMonitor/icons/Summary.svg'
import { getRegulatoryEnvColorWithAlpha } from '../../../map/layers/styles/administrativeAndRegulatoryLayers.style'

function RegulatoryLayerSearchResultZone({ regulatoryZone, searchedText }) {
  const dispatch = useDispatch()
  const { selectedRegulatoryLayerIds } = useSelector(state => state.regulatory)
  const { regulatoryMetadataLayerId, regulatoryMetadataPanelIsOpen } = useSelector(state => state.regulatoryMetadata)
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
      if (regulatoryZone?.doc?.geometry) {
        dispatch(setRegulatoryGeometriesToPreview([regulatoryZone?.doc?.geometry]))
      }
    }
  }

  return (
    <Zone $selected={isZoneSelected} onClick={toggleRegulatoryZoneMetadata}>
      <Rectangle $vectorLayerColor={getRegulatoryEnvColorWithAlpha(regulatoryZone?.doc?.properties?.thematique)} />
      <Name title={regulatoryZone?.doc?.properties?.entity_name}>
        <Highlighter
          autoEscape
          highlightClassName="highlight"
          searchWords={searchedText && searchedText.length > 0 ? searchedText.split(' ') : []}
          textToHighlight={regulatoryZone?.doc?.properties?.entity_name || ''}
        />
        {!regulatoryZone?.doc?.properties?.entity_name && 'AUCUN NOM'}
      </Name>
      {metadataIsShown ? (
        <CustomREGPaperDarkIcon onClick={toggleRegulatoryZoneMetadata} title="Fermer la réglementation" />
      ) : (
        <CustomREGPaperIcon onClick={toggleRegulatoryZoneMetadata} title="Afficher la réglementation" />
      )}
      <IconButton
        data-cy="regulatory-zone-check"
        icon={isZoneSelected ? <PinFullSVGIcon className="rs-icon" /> : <PinSVGIcon className="rs-icon" />}
        onClick={handleSelectRegulatoryZone}
        size="sm"
      />
    </Zone>
  )
}

const Name = styled.span`
  width: 280px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden !important;
  font-size: inherit;
  margin-top: 5px;
  text-align: left;
  span {
    text-overflow: ellipsis;
    white-space: nowrap;
  }
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
  text-align: left;
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
  width: 21px;
  height: 23px;
`

const CustomREGPaperIcon = styled(SummarySVG)`
  ${CustomPaperStyle}
`
const CustomREGPaperDarkIcon = styled(SummarySVG)`
  ${CustomPaperStyle}
  color: ${COLORS.charcoal};
`

const PinSVGIcon = styled(PinSVG)`
  width: 18px;
  height: 18px;
  margin: 2px;
`
const PinFullSVGIcon = styled(PinFullSVG)`
  width: 18px;
  height: 18px;
  margin: 2px;
  color: ${COLORS.blueGray};
`

export default RegulatoryLayerSearchResultZone
