import _ from 'lodash'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Tag, TagGroup, IconButton } from 'rsuite'
import styled from 'styled-components'

import { RegulatoryLayerZone } from './RegulatoryLayerZone'
import { COLORS } from '../../../../constants/constants'
import {
  hideRegulatoryLayers,
  removeRegulatoryZonesFromMyLayers,
  showRegulatoryLayer
} from '../../../../domain/shared_slices/Regulatory'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { ReactComponent as CloseIconSVG } from '../../../../uiMonitor/icons/Close.svg'
import { ReactComponent as DisplaySVG } from '../../../../uiMonitor/icons/Display.svg'
import { REGULATORY_LAYER_SEARCH_RESULT_ZONE_HEIGHT } from '../search/RegulatoryLayerSearchResultZone'

export function RegulatoryLayerGroup({ groupName, layers }) {
  const dispatch = useDispatch()
  const { showedRegulatoryLayerIds } = useAppSelector(state => state.regulatory)
  const { regulatoryMetadataLayerId } = useAppSelector(state => state.regulatoryMetadata)
  const groupLayerIds = layers.map(l => l.id)
  const [zonesAreOpen, setZonesAreOpen] = useState(false)
  const regulatoryZonesAreShowed = _.intersection(groupLayerIds, showedRegulatoryLayerIds).length > 0
  const metadataIsShowed = _.includes(groupLayerIds, regulatoryMetadataLayerId)

  const toggleLayerDisplay = e => {
    e.stopPropagation()
    if (regulatoryZonesAreShowed) {
      dispatch(hideRegulatoryLayers(groupLayerIds))
    } else {
      dispatch(showRegulatoryLayer(groupLayerIds))
    }
  }

  const handleRemoveZone = e => {
    e.stopPropagation()
    dispatch(removeRegulatoryZonesFromMyLayers(groupLayerIds))
  }

  const toggleZonesAreOpen = () => {
    if (!metadataIsShowed) {
      setZonesAreOpen(!zonesAreOpen)
    }
  }

  return (
    <>
      <LayerTopic onClick={toggleZonesAreOpen}>
        <TopicName data-cy="regulatory-layer-topic" title={groupName}>
          {groupName}
        </TopicName>
        <Icons>
          <TagGroup>
            <Tag size="sm">{`${layers?.length}`}</Tag>
          </TagGroup>
          {regulatoryZonesAreShowed ? (
            <IconButton
              appearance="subtle"
              data-cy="regulatory-layers-my-zones-zone-hide"
              icon={<ShowIcon className="rs-icon" />}
              onClick={toggleLayerDisplay}
              size="md"
              title="Cacher la/les zone(s)"
            />
          ) : (
            <IconButton
              appearance="subtle"
              data-cy="regulatory-layers-my-zones-zone-show"
              icon={<HideIcon className="rs-icon" />}
              onClick={toggleLayerDisplay}
              size="md"
              title="Afficher la/les zone(s)"
            />
          )}
          <IconButton
            appearance="subtle"
            data-cy="regulatory-layers-my-zones-zone-delete"
            icon={<CloseIconSVG className="rs-icon" />}
            onClick={handleRemoveZone}
            size="sm"
            title="Supprimer la/les zone(s) de ma sélection"
          />
        </Icons>
      </LayerTopic>
      <RegulatoryZones isOpen={zonesAreOpen || metadataIsShowed} length={layers?.length}>
        {layers?.map(regulatoryZone => (
          <RegulatoryLayerZone key={regulatoryZone.id} regulatoryZone={regulatoryZone} />
        ))}
      </RegulatoryZones>
    </>
  )
}

const TopicName = styled.span`
  user-select: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: block;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
  color: ${COLORS.gunMetal};
  max-width: 300px;
  line-height: 33px;
  flex: 1;
`

const LayerTopic = styled.li`
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
    background: ${COLORS.blueYonder25};
  }

  .rs-checkbox-checker {
    padding-top: 24px;
  }

  .rs-checkbox {
    margin-left: 0;
  }
`

const RegulatoryZones = styled.li<{ isOpen: boolean; length: number }>`
  height: ${p => (p.isOpen && p.length ? p.length * REGULATORY_LAYER_SEARCH_RESULT_ZONE_HEIGHT : 0)}px;
  overflow: hidden;
  transition: 0.5s all;
  border-bottom: ${p => (p.isOpen ? 1 : 0)}px solid ${COLORS.lightGray};
`
const Icons = styled.span`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 0;
  margin-right: 4px;
  > * {
    margin-right: 4px;
    margin-left: 4px;
  }
`
const ShowIcon = styled(DisplaySVG)`
  color: ${COLORS.blueGray};
`
const HideIcon = styled(DisplaySVG)`
  color: ${COLORS.slateGray};
`
