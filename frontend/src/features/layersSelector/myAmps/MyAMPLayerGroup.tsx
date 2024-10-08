import { getIsLinkingAMPToVigilanceArea, vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { Accent, Icon, IconButton, Size, THEME } from '@mtes-mct/monitor-ui'
import { difference, intersection } from 'lodash'
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
  setTotalNumberOfZones,
  showedAmpLayerIds
}: {
  groupName: string
  layers: AMP[]
  setTotalNumberOfZones: (totalNumberOfZones: number) => void
  showedAmpLayerIds: number[]
}) {
  const dispatch = useAppDispatch()
  const totalNumberOfZones = useAppSelector(state => getNumberOfAMPByGroupName(state, groupName))

  const groupLayerIds = layers.map(l => l.id)
  const [zonesAreOpen, setZonesAreOpen] = useState(false)
  const ampZonesAreShowed = intersection(groupLayerIds, showedAmpLayerIds).length > 0

  const ampLinkedToVigilanceAreaForm = useAppSelector(state => state.vigilanceArea.ampToAdd)
  const isLinkingAMPToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))

  const isLayerGroupDisabled = difference(groupLayerIds, ampLinkedToVigilanceAreaForm).length === 0

  const fitToGroupExtent = () => {
    const extent = getExtentOfLayersGroup(layers)
    dispatch(setFitToExtent(extent))
  }

  const handleClickOnGroupName = () => {
    if (zonesAreOpen) {
      fitToGroupExtent()
    }

    setTotalNumberOfZones(zonesAreOpen ? 0 : totalNumberOfZones)
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

  const addZonesToVigilanceArea = () => {
    dispatch(vigilanceAreaActions.addAmpIdsToVigilanceArea(groupLayerIds))
  }

  return (
    <>
      <LayerSelector.GroupWrapper $isOpen={zonesAreOpen} $isPadded onClick={toggleZonesAreOpen}>
        <LayerSelector.GroupName data-cy="amp-layer-topic" onClick={handleClickOnGroupName} title={groupName}>
          {groupName}
        </LayerSelector.GroupName>
        <LayerSelector.IconGroup>
          <LayerSelector.NumberOfZones>{`${layers?.length}/${totalNumberOfZones}`}</LayerSelector.NumberOfZones>
          {isLinkingAMPToVigilanceArea ? (
            <IconButton
              accent={Accent.TERTIARY}
              disabled={isLayerGroupDisabled}
              Icon={Icon.Plus}
              onClick={addZonesToVigilanceArea}
              title="Ajouter la/les zone(s) à la zone de vigilance"
            />
          ) : (
            <>
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
            </>
          )}
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
