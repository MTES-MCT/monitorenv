import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import Checkbox from 'rsuite/Checkbox'

// import showRegulatoryZoneMetadata from '../../../../domain/use_cases/showRegulatoryZoneMetadata'
// import closeRegulatoryZoneMetadata from '../../../../domain/use_cases/closeRegulatoryZoneMetadata'
import { setRegulatoryGeometriesToPreview, resetRegulatoryGeometriesToPreview } from '../../../../domain/shared_slices/Regulatory'

import { toggleRegulatoryZone } from './RegulatoryLayerSearch.slice'
// import { showOrHideMetadataIcon } from '../RegulatoryLayerZone'

import { getRegulatoryEnvColorWithAlpha } from '../../../../layers/styles/administrativeAndRegulatoryLayers.style'
import { REGPaperDarkIcon, REGPaperIcon } from '../../../commonStyles/icons/REGPaperIcon.style'
import { COLORS } from '../../../../constants/constants'

const RegulatoryLayerSearchResultZone = ({regulatoryZone}) => {
  const dispatch = useDispatch()

  const { regulatoryZonesChecked } = useSelector(state => state.regulatoryLayerSearch)
  const isZoneSelected = regulatoryZonesChecked.includes(regulatoryZone.id)
  const metadataIsShown = false


  const handleMouseOver = () => {
    if (regulatoryZone.geometry) {
      dispatch(setRegulatoryGeometriesToPreview([regulatoryZone.geometry]))
    }
  }
  const handleMouseOut = () => {
    dispatch(resetRegulatoryGeometriesToPreview())
  }

  const handleSelectRegulatoryZone = () => dispatch(toggleRegulatoryZone(regulatoryZone.id))

  const toggleRegulatoryZoneMetadata = () => console.log('togglemetadata')
  // value => value?.length
  // ? setZoneSelectionList([regulatoryZone])
  // : setZoneSelectionList([])
  return (
    <Zone onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} $selected={isZoneSelected}>
      <Rectangle $vectorLayerColor={getRegulatoryEnvColorWithAlpha(regulatoryZone?.doc?.properties?.thematique)}/>
      <Name onClick={handleSelectRegulatoryZone}
      >
        {regulatoryZone?.doc?.properties?.entity_name || 'AUCUN NOM'}
      </Name>
        {
          metadataIsShown
            ? <CustomREGPaperDarkIcon title="Fermer la réglementation" onClick={toggleRegulatoryZoneMetadata}/>
            : <CustomREGPaperIcon title="Afficher la réglementation" onClick={toggleRegulatoryZoneMetadata}/>
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

const CustomREGPaperIcon = styled(REGPaperIcon)`
  ${CustomPaperStyle}
`
const CustomREGPaperDarkIcon = styled(REGPaperDarkIcon)`
  ${CustomPaperStyle}
`

export default RegulatoryLayerSearchResultZone
