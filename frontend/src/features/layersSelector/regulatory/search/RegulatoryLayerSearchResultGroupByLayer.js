import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import styled from 'styled-components'
import Highlighter from 'react-highlight-words'

import RegulatoryLayerSearchResultZones from './RegulatoryLayerSearchResultZones'

import { ReactComponent as PinSVG } from '../../../icons/epingle.svg'
import { ReactComponent as PinFullSVG } from '../../../icons/epingle_pleine.svg'
import { COLORS } from '../../../../constants/constants'
import { IconButton } from 'rsuite'
import { addRegulatoryZonesToMyLayers, removeRegulatoryZonesFromMyLayers } from '../../../../domain/shared_slices/Regulatory'

export const RegulatoryLayerSearchResultGroupByLayer = ({ groupName, result, searchedText }) => {
  const dispatch = useDispatch()

  const { selectedRegulatoryLayerIds } = useSelector(state => state.regulatory)
  const totalNumberOfZones = useSelector(state => state.regulatory?.regulatoryLayersByLayerName[groupName]?.length)

  const [zonesAreOpen, setZonesAreOpen] = useState(false)
  const layerIds = _.map(result, 'id')
  const zonesSelected = _.intersection(selectedRegulatoryLayerIds, layerIds)
  const allTopicZonesAreChecked = zonesSelected?.length === layerIds?.length

  const handleCheckAllZones = (e) => {
    e.stopPropagation()
    if (allTopicZonesAreChecked) {
      dispatch(removeRegulatoryZonesFromMyLayers(layerIds))
    } else {
      dispatch(addRegulatoryZonesToMyLayers(layerIds))
    }
  }

  

  return (
    <>
      <LayerTopic onClick={() => setZonesAreOpen(!zonesAreOpen)}>
        <TopicName
        
        data-cy={'regulatory-layer-topic'}
        title={groupName}
        >
          <Highlighter
            highlightClassName="highlight"
            searchWords={(searchedText && searchedText.length > 0) ? searchedText.split(' '):[]}
            autoEscape={true}
            textToHighlight={groupName || ''}
          />
        </TopicName>
        
        <ZonesNumber>{`${result.length} / ${totalNumberOfZones}`}</ZonesNumber>
        
        <IconButton
          icon={allTopicZonesAreChecked ? <PinFullSVGIcon className='rs-icon' /> : <PinSVGIcon className='rs-icon' />}
          size='sm'
          onClick={handleCheckAllZones}
        />
      </LayerTopic>
      <RegulatoryLayerSearchResultZones
        result={result}
        searchedText={searchedText}
        zonesAreOpen={zonesAreOpen}
      />
    </>
  )
}

const ZonesNumber = styled.span`
  font-size: 13px;
  color: ${COLORS.slateGray};
  margin-left: auto;
  line-height: 34px;
  font-weight: 400;
`

const TopicName = styled.span`
  user-select: none;
  text-overflow: ellipsis;
  overflow-x: hidden !important;
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: ${COLORS.gunMetal};
  max-width: 300px;
  line-height: 33px;
`

const LayerTopic = styled.div`
  display: flex;
  user-select: none;
  text-overflow: ellipsis;
  overflow: hidden !important;
  padding-right: 0;
  height: 35px;
  font-size: 13px;
  padding-left: 18px;
  font-weight: 700;
  color: ${COLORS.gunMetal};
  border-bottom: 1px solid ${COLORS.lightGray};
 
  :hover {
    background: ${COLORS.shadowBlueLittleOpacity};
  }
  
  
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