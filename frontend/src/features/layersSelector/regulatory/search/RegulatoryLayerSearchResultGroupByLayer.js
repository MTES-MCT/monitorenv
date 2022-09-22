import _ from 'lodash'
import React, { useState } from 'react'
import Highlighter from 'react-highlight-words'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import {
  addRegulatoryZonesToMyLayers,
  removeRegulatoryZonesFromMyLayers
} from '../../../../domain/shared_slices/Regulatory'
import { ReactComponent as PinSVG } from '../../../../uiMonitor/icons/epingle.svg'
import { ReactComponent as PinFullSVG } from '../../../../uiMonitor/icons/epingle_pleine.svg'
import RegulatoryLayerSearchResultZones from './RegulatoryLayerSearchResultZones'

export function RegulatoryLayerSearchResultGroupByLayer({ groupName, result, searchedText }) {
  const dispatch = useDispatch()

  const { selectedRegulatoryLayerIds } = useSelector(state => state.regulatory)
  const totalNumberOfZones = useSelector(state => state.regulatory?.regulatoryLayersByLayerName[groupName]?.length)

  const [zonesAreOpen, setZonesAreOpen] = useState(false)
  const layerIds = _.map(result, 'id')
  const zonesSelected = _.intersection(selectedRegulatoryLayerIds, layerIds)
  const allTopicZonesAreChecked = zonesSelected?.length === layerIds?.length

  const handleCheckAllZones = e => {
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
        <TopicName data-cy="regulatory-layer-topic" title={groupName}>
          <Highlighter
            autoEscape
            highlightClassName="highlight"
            searchWords={searchedText && searchedText.length > 0 ? searchedText.split(' ') : []}
            textToHighlight={groupName || ''}
          />
        </TopicName>

        <ZonesNumber>{`${result.length} / ${totalNumberOfZones}`}</ZonesNumber>

        <IconButton
          icon={allTopicZonesAreChecked ? <PinFullSVGIcon className="rs-icon" /> : <PinSVGIcon className="rs-icon" />}
          onClick={handleCheckAllZones}
        />
      </LayerTopic>
      <RegulatoryLayerSearchResultZones result={result} searchedText={searchedText} zonesAreOpen={zonesAreOpen} />
    </>
  )
}

const ZonesNumber = styled.span`
  font-size: 13px;
  color: ${COLORS.slateGray};
  margin-left: auto;
  line-height: 34px;
  font-weight: 400;
  flex: 1;
  max-width: 50px;
`

const TopicName = styled.span`
  user-select: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden !important;
  display: block;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
  color: ${COLORS.gunMetal};
  max-width: 300px;
  line-height: 33px;
  flex: 1;
`

const LayerTopic = styled.div`
  display: flex;
  user-select: none;
  text-overflow: ellipsis;
  white-space: nowrap;
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
`
const PinFullSVGIcon = styled(PinFullSVG)`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  color: ${COLORS.steelBlue};
`
