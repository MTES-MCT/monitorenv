import { Accent, Icon, IconButton, Size, THEME } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { useState } from 'react'

import { MyAMPLayerZone } from './MyAMPLayerZone'
import { getNumberOfAMPByGroupName } from '../../../api/ampsAPI'
import { hideAmpLayers, removeAmpZonesFromMyLayers, showAmpLayer } from '../../../domain/shared_slices/Amp'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { getExtentOfLayersGroup } from '../utils/getExtentOfLayersGroup'
import { LayerSelector } from '../utils/LayerSelector.style'

import type { AMP } from '../../../domain/entities/AMPs'

export function MyAMPLayerGroup({
  groupName,
  layers,
  showedAmpLayerIds
}: {
  groupName: string
  layers: AMP[]
  showedAmpLayerIds: number[]
}) {
  const dispatch = useAppDispatch()
  const totalNumberOfZones = useAppSelector(state => getNumberOfAMPByGroupName(state, groupName))

  const groupLayerIds = layers.map(l => l.id)
  const [zonesAreOpen, setZonesAreOpen] = useState(false)
  const ampZonesAreShowed = _.intersection(groupLayerIds, showedAmpLayerIds).length > 0

  const fitToGroupExtent = () => {
    const extent = getExtentOfLayersGroup(layers)
    dispatch(setFitToExtent(extent))
  }

  const handleClickOnGroupName = () => {
    if (zonesAreOpen) {
      fitToGroupExtent()
    }
  }

  const handleRemoveZone = e => {
    e.stopPropagation()
    dispatch(removeAmpZonesFromMyLayers(groupLayerIds))
  }

  const toggleLayerDisplay = e => {
    e.stopPropagation()
    if (ampZonesAreShowed) {
      dispatch(hideAmpLayers(groupLayerIds))
    } else {
      fitToGroupExtent()
      dispatch(showAmpLayer(groupLayerIds))
    }
  }

  const toggleZonesAreOpen = () => {
    setZonesAreOpen(!zonesAreOpen)
  }

  return (
    <>
      <LayerSelector.GroupWrapper $isOpen={zonesAreOpen} $isPadded onClick={toggleZonesAreOpen}>
        <LayerSelector.GroupName data-cy="amp-layer-topic" onClick={handleClickOnGroupName} title={groupName}>
          {groupName}
        </LayerSelector.GroupName>
        <LayerSelector.IconGroup>
          <LayerSelector.NumberOfZones>{`${layers?.length}/${totalNumberOfZones}`}</LayerSelector.NumberOfZones>
          <IconButton
            accent={Accent.TERTIARY}
            color={ampZonesAreShowed ? THEME.color.charcoal : THEME.color.lightGray}
            data-cy={ampZonesAreShowed ? 'my-amp-zone-hide' : 'my-amp-zone-show'}
            Icon={Icon.Display}
            onClick={toggleLayerDisplay}
            title={ampZonesAreShowed ? 'Cacher la/les zone(s)' : 'Afficher la/les zone(s)'}
          />

          <IconButton
            accent={Accent.TERTIARY}
            color={THEME.color.slateGray}
            data-cy="my-amp-zone-delete"
            Icon={Icon.Close}
            onClick={handleRemoveZone}
            size={Size.SMALL}
            title="Supprimer la/les zone(s) de ma sélection"
          />
        </LayerSelector.IconGroup>
      </LayerSelector.GroupWrapper>
      <LayerSelector.GroupList isOpen={zonesAreOpen} length={layers?.length}>
        {layers?.map(layer => (
          <MyAMPLayerZone key={layer.id} amp={layer} isDisplayed={showedAmpLayerIds.includes(layer.id)} />
        ))}
      </LayerSelector.GroupList>
    </>
  )
}
