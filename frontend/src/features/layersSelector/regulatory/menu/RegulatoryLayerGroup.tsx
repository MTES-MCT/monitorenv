import { Tag, IconButton, Accent, Icon, Size } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { COLORS } from '../../../../constants/constants'
import {
  hideRegulatoryLayers,
  removeRegulatoryZonesFromMyLayers,
  showRegulatoryLayer
} from '../../../../domain/shared_slices/Regulatory'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { LayerSelector } from '../../search/utils/LayerSelector.style'
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
      <LayerSelector.LayerGroup onClick={toggleZonesAreOpen}>
        <LayerSelector.LayerGroupName data-cy="regulatory-layer-topic" title={groupName}>
          {groupName}
        </LayerSelector.LayerGroupName>
        <LayerSelector.IconGroup>
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
        </LayerSelector.IconGroup>
      </LayerSelector.LayerGroup>
      <LayerSelector.LayersWrapper isOpen={zonesAreOpen || metadataIsShowed} length={layers?.length}>
        {layers?.map(regulatoryZone => (
          <RegulatoryLayerZone key={regulatoryZone.id} regulatoryZone={regulatoryZone} />
        ))}
      </LayerSelector.LayersWrapper>
    </>
  )
}
