import { Tag, IconButton, Accent, Icon, Size } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { COLORS } from '../../../../constants/constants'
import {
  hideRegulatoryLayers,
  removeRegulatoryZonesFromMyLayers,
  showRegulatoryLayer
} from '../../../../domain/shared_slices/Regulatory'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { REGULATORY_LAYER_SEARCH_RESULT_ZONE_HEIGHT } from '../../search/RegulatoryLayer'
import { RegulatoryLayerZone } from './RegulatoryLayerZone'

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
          <Tag accent={Accent.PRIMARY}>{`${layers?.length}`}</Tag>
          <IconButton
            accent={Accent.TERTIARY}
            color={regulatoryZonesAreShowed ? COLORS.blueGray : COLORS.slateGray}
            data-cy={regulatoryZonesAreShowed ? 'regulatory-my-zones-zone-hide' : 'regulatory-my-zones-zone-show'}
            Icon={Icon.Display}
            iconSize={20}
            onClick={toggleLayerDisplay}
            size={Size.SMALL}
            title={regulatoryZonesAreShowed ? 'Cacher la/les zone(s)' : 'Afficher la/les zone(s)'}
          />

          <IconButton
            accent={Accent.TERTIARY}
            data-cy="regulatory-my-zones-zone-delete"
            Icon={Icon.Close}
            onClick={handleRemoveZone}
            size={Size.SMALL}
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
