import { IconButton, Accent, Icon, Size, THEME } from '@mtes-mct/monitor-ui'
import { getTitle } from 'domain/entities/layers/utils'
import _ from 'lodash'
import { useState } from 'react'

import { RegulatoryLayerZone } from './MyRegulatoryLayerZone'
import { getNumberOfRegulatoryLayerZonesByGroupName } from '../../../api/regulatoryLayersAPI'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import {
  hideRegulatoryLayers,
  removeRegulatoryZonesFromMyLayers,
  showRegulatoryLayer
} from '../../../domain/shared_slices/Regulatory'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { getMetadataIsOpenForRegulatoryLayerIds } from '../metadataPanel/slice'
import { getExtentOfLayersGroup } from '../utils/getExtentOfLayersGroup'
import { LayerSelector } from '../utils/LayerSelector.style'

import type { RegulatoryLayerCompact } from '../../../domain/entities/regulatory'

export function RegulatoryLayerGroup({
  groupName,
  layers,
  setTotalNumberOfZones
}: {
  groupName: string
  layers: RegulatoryLayerCompact[]
  setTotalNumberOfZones: (totalNumberOfZones: number) => void
}) {
  const dispatch = useAppDispatch()
  const groupLayerIds = layers.map(l => l.id)
  const showedRegulatoryLayerIds = useAppSelector(state => state.regulatory.showedRegulatoryLayerIds)
  const metadataPanelIsOpen = useAppSelector(state => getMetadataIsOpenForRegulatoryLayerIds(state, groupLayerIds))
  const [zonesAreOpen, setZonesAreOpen] = useState(false)
  const regulatoryZonesAreShowed = _.intersection(groupLayerIds, showedRegulatoryLayerIds).length > 0
  const totalNumberOfZones = useAppSelector(state => getNumberOfRegulatoryLayerZonesByGroupName(state, groupName))

  const fitToGroupExtent = () => {
    const extent = getExtentOfLayersGroup(layers)
    dispatch(setFitToExtent(extent))
  }

  const handleClickOnGroupName = () => {
    if (!zonesAreOpen && regulatoryZonesAreShowed) {
      fitToGroupExtent()
    }

    setTotalNumberOfZones(zonesAreOpen ? 0 : totalNumberOfZones)
  }

  const handleRemoveZone = e => {
    e.stopPropagation()
    dispatch(removeRegulatoryZonesFromMyLayers(groupLayerIds))
  }

  const toggleLayerDisplay = e => {
    e.stopPropagation()
    if (regulatoryZonesAreShowed) {
      dispatch(hideRegulatoryLayers(groupLayerIds))
    } else {
      const extent = getExtentOfLayersGroup(layers)
      dispatch(setFitToExtent(extent))
      dispatch(showRegulatoryLayer(groupLayerIds))
    }
  }

  const toggleZonesAreOpen = () => {
    if (!metadataPanelIsOpen) {
      setZonesAreOpen(!zonesAreOpen)
    }
  }

  return (
    <>
      <LayerSelector.GroupWrapper $isOpen={zonesAreOpen} $isPadded onClick={toggleZonesAreOpen}>
        <LayerSelector.GroupName
          data-cy="my-regulatory-group"
          onClick={handleClickOnGroupName}
          title={getTitle(groupName)}
        >
          {getTitle(groupName)}
        </LayerSelector.GroupName>
        <LayerSelector.IconGroup>
          <LayerSelector.NumberOfZones>{`${layers?.length}/${totalNumberOfZones}`}</LayerSelector.NumberOfZones>
          <IconButton
            accent={Accent.TERTIARY}
            aria-label={regulatoryZonesAreShowed ? 'Cacher la/les zone(s)' : 'Afficher la/les zone(s)'}
            color={regulatoryZonesAreShowed ? THEME.color.charcoal : THEME.color.lightGray}
            Icon={Icon.Display}
            onClick={toggleLayerDisplay}
            title={regulatoryZonesAreShowed ? 'Cacher la/les zone(s)' : 'Afficher la/les zone(s)'}
          />

          <IconButton
            accent={Accent.TERTIARY}
            color={THEME.color.slateGray}
            data-cy="my-regulatory-group-delete"
            Icon={Icon.Close}
            onClick={handleRemoveZone}
            size={Size.SMALL}
            title="Supprimer la/les zone(s) de ma sélection"
          />
        </LayerSelector.IconGroup>
      </LayerSelector.GroupWrapper>
      <LayerSelector.GroupList isOpen={zonesAreOpen || metadataPanelIsOpen} length={layers?.length}>
        {layers?.map(regulatoryZone => (
          <RegulatoryLayerZone key={regulatoryZone.id} regulatoryZone={regulatoryZone} />
        ))}
      </LayerSelector.GroupList>
    </>
  )
}
