import _ from 'lodash'
import { useState } from 'react'
import Highlighter from 'react-highlight-words'
import { useDispatch } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { REGULATORY_LAYER_SEARCH_RESULT_ZONE_HEIGHT } from './RegulatoryLayerSearchResultZone'
import { RegulatoryLayerSearchResultZones } from './RegulatoryLayerSearchResultZones'
import { COLORS } from '../../../../constants/constants'
import {
  addRegulatoryZonesToMyLayers,
  removeRegulatoryZonesFromMyLayers
} from '../../../../domain/shared_slices/Regulatory'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { ReactComponent as PinSVG } from '../../../../uiMonitor/icons/Pin.svg'
import { ReactComponent as PinFullSVG } from '../../../../uiMonitor/icons/Pin_filled.svg'

export function RegulatoryLayerSearchResultGroupByLayer({ groupName, result, searchedText }) {
  const dispatch = useDispatch()

  const { selectedRegulatoryLayerIds } = useAppSelector(state => state.regulatory)
  const { regulatoryMetadataLayerId } = useAppSelector(state => state.regulatoryMetadata)
  const totalNumberOfZones = useAppSelector(state => state.regulatory?.regulatoryLayersByLayerName[groupName]?.length)

  const [zonesAreOpen, setZonesAreOpen] = useState(false)
  const layerIds = _.map(result, 'id')
  const zonesSelected = _.intersection(selectedRegulatoryLayerIds, layerIds)
  const forceZonesAreOpen = _.includes(layerIds, regulatoryMetadataLayerId)
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
        <Icons>
          <ZonesNumber>{`${result.length} / ${totalNumberOfZones}`}</ZonesNumber>
          <StyledIconButton
            $allTopicZonesAreChecked={allTopicZonesAreChecked}
            appearance="subtle"
            icon={allTopicZonesAreChecked ? <PinFullSVGIcon className="rs-icon" /> : <PinSVGIcon className="rs-icon" />}
            onClick={handleCheckAllZones}
            size="md"
          />
        </Icons>
      </LayerTopic>
      <RegulatoryLayerSearchResultZones
        result={result}
        searchedText={searchedText}
        zonesAreOpen={forceZonesAreOpen || zonesAreOpen}
      />
    </>
  )
}

const ZonesNumber = styled.span`
  font-size: 13px;
  color: ${COLORS.slateGray};
  margin-left: auto;
  margin-right: 8px;
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
  padding-right: 8px;
`

const LayerTopic = styled.li`
  display: flex;
  user-select: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden !important;
  padding-right: 0;
  height: ${REGULATORY_LAYER_SEARCH_RESULT_ZONE_HEIGHT}px;
  font-size: 13px;
  padding-left: 18px;
  font-weight: 700;
  color: ${COLORS.gunMetal};
  border-bottom: 1px solid ${COLORS.lightGray};

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
`
const StyledIconButton = styled(IconButton)<{ $allTopicZonesAreChecked: boolean }>`
  :focus {
    color: ${COLORS.blueYonder};
  }
  ${p => (p.$allTopicZonesAreChecked ? `color: ${COLORS.blueGray}` : '')};
`

const PinSVGIcon = styled(PinSVG)`
  color: ${COLORS.slateGray};
  :hover,
  :focus,
  :active {
    color: ${COLORS.blueYonder};
  }
`
const PinFullSVGIcon = styled(PinFullSVG)`
  color: ${COLORS.blueGray};
  :hover,
  :focus,
  :active {
    color: ${COLORS.blueYonder};
  }
`
