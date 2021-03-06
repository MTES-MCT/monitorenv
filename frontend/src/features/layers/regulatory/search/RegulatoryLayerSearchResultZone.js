import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import Checkbox from 'rsuite/Checkbox'
import Highlighter from 'react-highlight-words'

import showRegulatoryZoneMetadata from '../../../../domain/use_cases/showRegulatoryZoneMetadata'
import closeRegulatoryZoneMetadata from '../../../../domain/use_cases/closeRegulatoryZoneMetadata'
import { setRegulatoryGeometriesToPreview } from '../../../../domain/shared_slices/Regulatory'

import { toggleRegulatoryZone } from './RegulatoryLayerSearch.slice'
// import { showOrHideMetadataIcon } from '../RegulatoryLayerZone'

import { getRegulatoryEnvColorWithAlpha } from '../../../../layers/styles/administrativeAndRegulatoryLayers.style'
import { ReactComponent as ZoomIconSVG } from '../../../icons/target.svg'
import { REGPaperDarkIcon, REGPaperIcon } from '../../../commonStyles/icons/REGPaperIcon.style'
import { COLORS } from '../../../../constants/constants'

const RegulatoryLayerSearchResultZone = ({regulatoryZone, searchedText}) => {
  const dispatch = useDispatch()

  const { regulatoryZonesChecked } = useSelector(state => state.regulatoryLayerSearch)
  const { regulatoryMetadataPanelIsOpen, regulatoryMetadataLayerId } = useSelector(state => state.regulatoryMetadata)
  const isZoneSelected = regulatoryZonesChecked.includes(regulatoryZone.id)
  const metadataIsShown = regulatoryMetadataPanelIsOpen && regulatoryZone.id === regulatoryMetadataLayerId


  const handleZoomToZones = () => {
    if (regulatoryZone?.doc?.geometry) {
      dispatch(setRegulatoryGeometriesToPreview([regulatoryZone?.doc?.geometry]))
    }
  }

  const handleSelectRegulatoryZone = () => dispatch(toggleRegulatoryZone(regulatoryZone.id))

  const toggleRegulatoryZoneMetadata = () => {
    metadataIsShown ? dispatch(closeRegulatoryZoneMetadata()) : dispatch(showRegulatoryZoneMetadata(regulatoryZone.id))
  }
  // value => value?.length
  // ? setZoneSelectionList([regulatoryZone])
  // : setZoneSelectionList([])
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
      <ZoomIcon onClick={handleZoomToZones}></ZoomIcon>
        {
          metadataIsShown
            ? <CustomREGPaperDarkIcon title="Fermer la r??glementation" onClick={toggleRegulatoryZoneMetadata}/>
            : <CustomREGPaperIcon title="Afficher la r??glementation" onClick={toggleRegulatoryZoneMetadata}/>
        }
        <Checkbox
          checked={isZoneSelected}
          onChange={handleSelectRegulatoryZone}
          data-cy={'regulatory-zone-check'}
          value={regulatoryZone.id}
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

const ZoomIcon = styled(ZoomIconSVG)`
  padding-top: 10px;
  padding-left: 5px;
  padding-right: 5px;
`

const CustomREGPaperIcon = styled(REGPaperIcon)`
  ${CustomPaperStyle}
`
const CustomREGPaperDarkIcon = styled(REGPaperDarkIcon)`
  ${CustomPaperStyle}
`

export default RegulatoryLayerSearchResultZone
