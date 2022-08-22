import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import { IconButton } from 'rsuite'
import Highlighter from 'react-highlight-words'

import showRegulatoryZoneMetadata from '../../../../domain/use_cases/regulatory/showRegulatoryZoneMetadata'
import { closeRegulatoryZoneMetadata } from '../../../../domain/use_cases/regulatory/closeRegulatoryZoneMetadata'
import { setRegulatoryGeometriesToPreview } from '../../../../domain/shared_slices/Regulatory'
import { addRegulatoryZonesToMyLayers, removeRegulatoryZonesFromMyLayers } from '../../../../domain/shared_slices/Regulatory'

import { getRegulatoryEnvColorWithAlpha } from '../../../map/layers/styles/administrativeAndRegulatoryLayers.style'
import { REGPaperDarkIcon, REGPaperIcon } from '../../../commonStyles/icons/REGPaperIcon.style'
import { ReactComponent as PinSVG } from '../../../../uiMonitor/icons/epingle.svg'
import { ReactComponent as PinFullSVG } from '../../../../uiMonitor/icons/epingle_pleine.svg'

import { COLORS } from '../../../../constants/constants'

const RegulatoryLayerSearchResultZone = ({regulatoryZone, searchedText}) => {
  const dispatch = useDispatch()
  const { selectedRegulatoryLayerIds } = useSelector(state => state.regulatory)
  const { regulatoryMetadataPanelIsOpen, regulatoryMetadataLayerId } = useSelector(state => state.regulatoryMetadata)
  const isZoneSelected = selectedRegulatoryLayerIds.includes(regulatoryZone.id)
  const metadataIsShown = regulatoryMetadataPanelIsOpen && regulatoryZone.id === regulatoryMetadataLayerId

  const handleSelectRegulatoryZone = () => {
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
    <Zone  $selected={isZoneSelected}>
      <Rectangle $vectorLayerColor={getRegulatoryEnvColorWithAlpha(regulatoryZone?.doc?.properties?.thematique)}/>
      <Name 
        onClick={handleSelectRegulatoryZone}
        title={regulatoryZone?.doc?.properties?.entity_name}
      >
        <Highlighter
            highlightClassName="highlight"
            searchWords={(searchedText && searchedText.length > 0) ? searchedText.split(' '):[]}
            autoEscape={true}
            textToHighlight={regulatoryZone?.doc?.properties?.entity_name || ''}
          />
        {!regulatoryZone?.doc?.properties?.entity_name && 'AUCUN NOM'}
      </Name>
        {
          metadataIsShown
            ? <CustomREGPaperDarkIcon title="Fermer la réglementation" onClick={toggleRegulatoryZoneMetadata}/>
            : <CustomREGPaperIcon title="Afficher la réglementation" onClick={toggleRegulatoryZoneMetadata}/>
        }
        <IconButton
          data-cy={'regulatory-zone-check'}
          icon={isZoneSelected ? <PinFullSVGIcon className='rs-icon' /> : <PinSVGIcon className='rs-icon' />}
          size='sm'
          onClick={handleSelectRegulatoryZone}
        />
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
  background: ${props => props.$selected ? COLORS.gray : COLORS.background};
  color: ${COLORS.gunMetal};
  padding-top: 1px;
  padding-bottom: 5px;
  
  :hover {
    background: ${COLORS.shadowBlueLittleOpacity};
  }
`

const CustomPaperStyle = css`
  margin-right: -2px;
  padding-top: 7px;
  width: 21px;
  height: 23px
`

const CustomREGPaperIcon = styled(REGPaperIcon)`
  ${CustomPaperStyle}
`
const CustomREGPaperDarkIcon = styled(REGPaperDarkIcon)`
  ${CustomPaperStyle}
`


const PinSVGIcon = styled(PinSVG)`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  margin-right: 8px;
`
const PinFullSVGIcon = styled(PinFullSVG)`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  margin-right: 8px;
  color: ${COLORS.steelBlue};
`

export default RegulatoryLayerSearchResultZone
