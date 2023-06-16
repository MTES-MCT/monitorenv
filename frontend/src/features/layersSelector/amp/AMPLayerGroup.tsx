import { Accent, Icon, IconButton, Size, Tag } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { COLORS } from '../../../constants/constants'
import { hideAmpLayers, removeAmpZonesFromMyLayers, showAmpLayer } from '../../../domain/shared_slices/SelectedAmp'
import { LayerSelector } from '../search/utils/LayerSelector.style'
import { AMPLayerZone } from './AMPLayerZone'

export const AMP_LAYER_ZONE_HEIGHT = 36

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
      <LayerSelector.LayerGroup onClick={toggleZonesAreOpen}>
        <LayerSelector.LayerGroupName data-cy="amp-layer-topic" title={groupName}>
          {groupName}
        </LayerSelector.LayerGroupName>
        <LayerSelector.IconGroup>
          <Tag accent={Accent.PRIMARY}>{`${layers?.length}`}</Tag>
          <IconButton
            accent={Accent.TERTIARY}
            color={ampZonesAreShowed ? COLORS.blueGray : COLORS.slateGray}
            data-cy={ampZonesAreShowed ? 'amp-my-zones-zone-hide' : 'amp-my-zones-zone-show'}
            Icon={Icon.Display}
            iconSize={20}
            onClick={toggleLayerDisplay}
            size={Size.SMALL}
            title={ampZonesAreShowed ? 'Cacher la/les zone(s)' : 'Afficher la/les zone(s)'}
          />

          <IconButton
            accent={Accent.TERTIARY}
            data-cy="amp-layers-my-zones-zone-delete"
            Icon={Icon.Close}
            onClick={handleRemoveZone}
            size={Size.SMALL}
            title="Supprimer la/les zone(s) de ma sélection"
          />
        </LayerSelector.IconGroup>
      </LayerSelector.LayerGroup>
      <LayerSelector.LayersWrapper isOpen={zonesAreOpen} length={layers?.length}>
        {layers?.map(layer => (
          <AMPLayerZone key={layer.id} amp={layer} isDisplayed={showedAmpLayerIds.includes(layer.id)} />
        ))}
      </LayerSelector.LayersWrapper>
    </>
  )
}
