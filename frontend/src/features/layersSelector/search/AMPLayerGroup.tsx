import { IconButton, Icon, Accent, Size } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { useState } from 'react'
import Highlighter from 'react-highlight-words'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { addAmpZonesToMyLayers, removeAmpZonesFromMyLayers } from '../../../domain/shared_slices/SelectedAmp'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { AMPLayer, REGULATORY_LAYER_SEARCH_RESULT_ZONE_HEIGHT } from './AMPLayer'

import type { AMP } from '../../../domain/entities/AMPs'

export function AMPLayerGroup({
  groupName,
  groups,
  layerIds,
  searchedText
}: {
  groupName: string
  groups: _.Dictionary<(AMP | undefined)[]>
  layerIds: number[]
  searchedText: string
}) {
  const dispatch = useDispatch()

  const { selectedAmpLayerIds } = useAppSelector(state => state.selectedAmp)
  const totalNumberOfZones = groups[groupName]?.length
  const [zonesAreOpen, setZonesAreOpen] = useState(false)
  const zonesSelected = _.intersection(selectedAmpLayerIds, layerIds)
  const allTopicZonesAreChecked = zonesSelected?.length === layerIds?.length

  const handleCheckAllZones = e => {
    e.stopPropagation()
    if (allTopicZonesAreChecked) {
      dispatch(removeAmpZonesFromMyLayers(layerIds))
    } else {
      dispatch(addAmpZonesToMyLayers(layerIds))
    }
  }

  return (
    <>
      <LayerTopic onClick={() => setZonesAreOpen(!zonesAreOpen)}>
        <TopicName data-cy="amp-layer-topic" title={groupName}>
          <Highlighter
            autoEscape
            highlightClassName="highlight"
            searchWords={searchedText && searchedText.length > 0 ? searchedText.split(' ') : []}
            textToHighlight={groupName || ''}
          />
        </TopicName>
        <Icons>
          <ZonesNumber>{`${layerIds.length} / ${totalNumberOfZones}`}</ZonesNumber>
          <StyledIconButton
            $allTopicZonesAreChecked={allTopicZonesAreChecked}
            accent={Accent.TERTIARY}
            Icon={allTopicZonesAreChecked ? Icon.Pin : Icon.Pin}
            onClick={handleCheckAllZones}
            size={Size.SMALL}
          />
        </Icons>
      </LayerTopic>
      <SubGroup isOpen={zonesAreOpen} length={layerIds?.length}>
        {layerIds?.map(layerId => (
          <AMPLayer key={layerId} layerId={layerId} searchedText={searchedText} />
        ))}
      </SubGroup>
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
  background: ${COLORS.ampBackground};
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

const SubGroup = styled.div<{ isOpen: boolean; length: number }>`
  height: ${props => (props.isOpen && props.length ? props.length * REGULATORY_LAYER_SEARCH_RESULT_ZONE_HEIGHT : 0)}px;
  overflow: hidden;
  transition: 0.5s all;
  border-bottom: ${p => (p.isOpen ? 1 : 0)}px solid ${COLORS.lightGray};
`
