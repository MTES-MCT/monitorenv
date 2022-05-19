import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import styled from 'styled-components'
import Checkbox from 'rsuite/Checkbox'
import Highlighter from 'react-highlight-words'

import {checkRegulatoryZones, uncheckRegulatoryZones} from "./RegulatoryLayerSearch.slice";
import { setRegulatoryGeometriesToPreview } from '../../../../domain/shared_slices/Regulatory'
import RegulatoryLayerSearchResultZones from './RegulatoryLayerSearchResultZones'
import { ReactComponent as ZoomIconSVG } from '../../../icons/target.svg'
import { COLORS } from '../../../../constants/constants'

const NumberOfZones = ({numberOfZones}) => {
  return (
    <ZonesNumber>
      {`${numberOfZones} zone${numberOfZones > 1 ? 's' : ''}`}
    </ZonesNumber>
  )
}

export const RegulatoryLayerSearchResultGroupSecondLevel = ({ groupName, result, searchedText }) => {
  const dispatch = useDispatch()

  const { regulatoryZonesChecked } = useSelector(state => state.regulatoryLayerSearch)

  const [zonesAreOpen, setZonesAreOpen] = useState(false)
  const groupZoneId = _.map(result, 'id')
  const zonesSelected = _.intersection(regulatoryZonesChecked, groupZoneId)
  const allTopicZonesAreChecked = zonesSelected?.length === groupZoneId?.length

  const handleCheckAllZones = () => {
    if (allTopicZonesAreChecked) {
      dispatch(uncheckRegulatoryZones(zonesSelected))
    } else {
      dispatch(checkRegulatoryZones(groupZoneId))
    }
  }

  const handleZoomToZones = () => {
    if (result.length > 0) {
      const features = result.map(topic => topic?.doc?.geometry)
      dispatch(setRegulatoryGeometriesToPreview(features))
    }
  }
  

  return (
    <>
      <LayerTopic onClick={() => setZonesAreOpen(!zonesAreOpen)} >
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
        <NumberOfZones numberOfZones={result.length} />
        <ZoomIcon onClick={handleZoomToZones}></ZoomIcon>
        <Checkbox
            onClick={(e)=> e.stopPropagation()}
            indeterminate={ zonesSelected.length > 0 && !allTopicZonesAreChecked }
            checked={allTopicZonesAreChecked}
            value={groupName}
            onChange={handleCheckAllZones}
            style={{ marginLeft: 0, height: 20 }}
        />
      </LayerTopic>
      <RegulatoryLayerSearchResultZones
        result={result}
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
  
  .rs-checkbox-checker {
    padding-top: 24px;
  }
  
  .rs-checkbox {
    margin-left: 0;
  }
`
const ZoomIcon = styled(ZoomIconSVG)`
  padding-top: 10px;
  padding-left: 10px;
`