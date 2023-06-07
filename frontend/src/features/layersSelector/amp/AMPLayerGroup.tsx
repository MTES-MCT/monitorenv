import { Accent, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Tag, TagGroup } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { hideAmpLayers, removeAmpZonesFromMyLayers, showAmpLayer } from '../../../domain/shared_slices/SelectedAmp'
import { REGULATORY_LAYER_SEARCH_RESULT_ZONE_HEIGHT } from '../search/RegulatoryLayer'
import { AMPLayerZone } from './AMPLayerZone'

export function AMPLayerGroup({ groupName, layers, showedAmpLayerIds }) {
  const dispatch = useDispatch()

  const groupLayerIds = layers.map(l => l.id)
  const [zonesAreOpen, setZonesAreOpen] = useState(false)
  const ampZonesAreShowed = _.intersection(groupLayerIds, showedAmpLayerIds).length > 0

  const toggleLayerDisplay = e => {
    e.stopPropagation()
    if (ampZonesAreShowed) {
      dispatch(hideAmpLayers(groupLayerIds))
    } else {
      dispatch(showAmpLayer(groupLayerIds))
    }
  }

  const handleRemoveZone = e => {
    e.stopPropagation()
    dispatch(removeAmpZonesFromMyLayers(groupLayerIds))
  }

  const toggleZonesAreOpen = () => {
    setZonesAreOpen(!zonesAreOpen)
  }

  return (
    <>
      <LayerTopic onClick={toggleZonesAreOpen}>
        <TopicName data-cy="amp-layer-topic" title={groupName}>
          {groupName}
        </TopicName>
        <Icons>
          <TagGroup>
            <Tag size="sm">{`${layers?.length}`}</Tag>
          </TagGroup>
          {ampZonesAreShowed ? (
            <IconButton
              accent={Accent.TERTIARY}
              data-cy="amp-layers-my-zones-zone-hide"
              Icon={Icon.Display}
              onClick={toggleLayerDisplay}
              size={Size.SMALL}
              title="Cacher la/les zone(s)"
            />
          ) : (
            <IconButton
              accent={Accent.TERTIARY}
              data-cy="amp-layers-my-zones-zone-show"
              Icon={Icon.Display}
              onClick={toggleLayerDisplay}
              size={Size.SMALL}
              title="Afficher la/les zone(s)"
            />
          )}
          <IconButton
            accent={Accent.TERTIARY}
            data-cy="amp-layers-my-zones-zone-delete"
            Icon={Icon.Close}
            onClick={handleRemoveZone}
            size={Size.SMALL}
            title="Supprimer la/les zone(s) de ma sélection"
          />
        </Icons>
      </LayerTopic>
      <AMPZones isOpen={zonesAreOpen} length={layers?.length}>
        {layers?.map(layer => (
          <AMPLayerZone key={layer.id} amp={layer} isDisplayed={showedAmpLayerIds.includes(layer.id)} />
        ))}
      </AMPZones>
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

const AMPZones = styled.li<{ isOpen: boolean; length: number }>`
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
