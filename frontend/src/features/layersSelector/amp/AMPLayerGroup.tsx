import {
  Accent,
  Icon,
  IconButton,
  OPENLAYERS_PROJECTION,
  Size,
  Tag,
  THEME,
  WSG84_PROJECTION
} from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { createEmpty, extend } from 'ol/extent'
import { Projection, transformExtent } from 'ol/proj'
import { useState } from 'react'

import { AMPLayerZone } from './AMPLayerZone'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { hideAmpLayers, removeAmpZonesFromMyLayers, showAmpLayer } from '../../../domain/shared_slices/SelectedAmp'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { LayerSelector } from '../utils/LayerSelector.style'

import type { AMP } from '../../../domain/entities/AMPs'

export function AMPLayerGroup({
  groupName,
  layers,
  showedAmpLayerIds
}: {
  groupName: string
  layers: AMP[]
  showedAmpLayerIds: number[]
}) {
  const dispatch = useAppDispatch()

  const groupLayerIds = layers.map(l => l.id)
  const [zonesAreOpen, setZonesAreOpen] = useState(false)
  const ampZonesAreShowed = _.intersection(groupLayerIds, showedAmpLayerIds).length > 0

  const toggleLayerDisplay = e => {
    e.stopPropagation()
    if (ampZonesAreShowed) {
      dispatch(hideAmpLayers(groupLayerIds))
    } else {
      const extentOfGroupLayers = layers.reduce((accumulatedExtent, currentLayer) => {
        const extendedExtent = [...accumulatedExtent]
        extend(extendedExtent, currentLayer.bbox)

        return extendedExtent
      }, createEmpty())
      const extent =
        extentOfGroupLayers &&
        transformExtent(
          extentOfGroupLayers,
          new Projection({ code: WSG84_PROJECTION }),
          new Projection({ code: OPENLAYERS_PROJECTION })
        )
      dispatch(setFitToExtent(extent))
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
      <LayerSelector.GroupWrapper $isPadded onClick={toggleZonesAreOpen}>
        <LayerSelector.GroupName data-cy="amp-layer-topic" title={groupName}>
          {groupName}
        </LayerSelector.GroupName>
        <LayerSelector.IconGroup>
          <Tag accent={Accent.PRIMARY}>{layers?.length}</Tag>
          <IconButton
            accent={Accent.TERTIARY}
            color={ampZonesAreShowed ? THEME.color.blueGray : THEME.color.slateGray}
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
      </LayerSelector.GroupWrapper>
      <LayerSelector.GroupList isOpen={zonesAreOpen} length={layers?.length}>
        {layers?.map(layer => (
          <AMPLayerZone key={layer.id} amp={layer} isDisplayed={showedAmpLayerIds.includes(layer.id)} />
        ))}
      </LayerSelector.GroupList>
    </>
  )
}
