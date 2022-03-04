import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import Checkbox from 'rsuite/Checkbox'
import CheckboxGroup from 'rsuite/CheckboxGroup'

import { setRegulatoryGeometriesToPreview, resetRegulatoryGeometriesToPreview } from '../../../../domain/shared_slices/Regulatory'
import RegulatoryLayerSearchResultZones from './RegulatoryLayerSearchResultZones'
// import { checkRegulatoryZones, uncheckRegulatoryZones } from './RegulatoryLayerSearch.slice'
import { COLORS } from '../../../../constants/constants'

const NumberOfZones = ({numberOfZones}) => {
  return (
    <ZonesNumber>
      {`${numberOfZones} zone${numberOfZones > 1 ? 's' : ''}`}
    </ZonesNumber>
  )
}
const RegulatoryLayerSearchResultTopic = ({ title, result }) => {
  const dispatch = useDispatch()

  // const {
  //   regulatoryLayersSearchResult,
  //   regulatoryZonesChecked
  // } = useSelector(state => state.regulatoryLayerSearch)

  const [topicSelection, setTopicSelection] = useState([])
  const [zonesAreOpen, setZonesAreOpen] = useState(false)
  // const allTopicZonesAreChecked = false
  // const allTopicZonesAreChecked = useCallback(() => {
  //   if (!regulatoryZonesChecked || !regulatoryLayerTopic) {
  //     return false
  //   }

  //   const zonesCheckedLength = regulatoryZonesChecked
  //     .filter(zone => zone.topic === regulatoryLayerTopic).length
  //   const allZonesLength = topicDetails.length
  //   if (!zonesCheckedLength || !allZonesLength) {
  //     return false
  //   }

  //   if (zonesCheckedLength === allZonesLength) {
  //     return true
  //   }
  // }, [regulatoryZonesChecked, topicDetails])

  // useEffect(() => {
  //   if (allTopicZonesAreChecked) {
  //     if (topicSelection && !topicSelection.length) {
  //       setTopicSelection([regulatoryLayerTopic])
  //     }
  //   } else {
  //     if (topicSelection && topicSelection.length) {
  //       setTopicSelection([])
  //     }
  //   }
  // }, [regulatoryZonesChecked, regulatoryLayersSearchResult])

  

  const handleCheckAllZones = () => {
    console.log('checkall')
    if (topicSelection.length > 0) {
      setTopicSelection(result?.map(r => r.id))
    } else {
      setTopicSelection([])
    }
  }

  const handleMouseOver = () => {
    if (result.length > 0) {
      console.log(result)
      const features = result.map(topic => topic?.doc?.geometry)
      console.log(features)
      dispatch(setRegulatoryGeometriesToPreview(features))
    }
  }
  const handleMouseOut = () => {
    dispatch(resetRegulatoryGeometriesToPreview())
  }

  return (
    <>
      <LayerTopic onClick={() => setZonesAreOpen(!zonesAreOpen)} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        <TopicName
          data-cy={'regulatory-layer-topic'}
          title={title}
        >
          {title}
        </TopicName>
         <NumberOfZones numberOfZones={result.length} />
        <CheckboxGroup
          onClick={e => e.stopPropagation()}
          inline
          name="checkboxList"
          value={topicSelection}
          onChange={handleCheckAllZones}
          style={{ marginLeft: 0, height: 20 }}
        >
          <Checkbox value={title}/>
        </CheckboxGroup>
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

export default RegulatoryLayerSearchResultTopic
