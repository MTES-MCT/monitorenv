import {
  getExtentOfRegulatoryLayersGroupByGroupName,
  getNumberOfRegulatoryLayerZonesByGroupName
} from '@api/regulatoryLayersAPI'
import { getDisplayedMetadataRegulatoryLayerId } from '@features/layersSelector/metadataPanel/slice'
import { LayerSelector } from '@features/layersSelector/utils/LayerSelector.style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { getTitle } from 'domain/entities/layers/utils'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { includes, intersection } from 'lodash'
import { useState } from 'react'

import { Layer } from './Layer'

type ResultListLayerGroupProps = {
  groupName: string
  layerIds: number[]
}
export function ListLayerGroup({ groupName, layerIds }: ResultListLayerGroupProps) {
  const dispatch = useAppDispatch()
  const [zonesAreOpen, setZonesAreOpen] = useState(false)

  const layerIdToDisplay = useAppSelector(state => getDisplayedMetadataRegulatoryLayerId(state))
  const totalNumberOfZones = useAppSelector(state => getNumberOfRegulatoryLayerZonesByGroupName(state, groupName))
  const groupExtent = useAppSelector(state => getExtentOfRegulatoryLayersGroupByGroupName(state, groupName))

  const selectedLayerIds = []
  const zonesSelected = intersection(selectedLayerIds, layerIds)
  const allTopicZonesAreChecked = zonesSelected?.length === layerIds?.length
  const forceZonesAreOpen = includes(layerIds, layerIdToDisplay)

  const handleCheckAllZones = e => {
    e.stopPropagation()
  }

  const clickOnGroupZones = () => {
    setZonesAreOpen(!zonesAreOpen)

    if (!zonesAreOpen) {
      dispatch(setFitToExtent(groupExtent))
    }
  }

  return (
    <>
      <LayerSelector.GroupWrapper $isOpen={forceZonesAreOpen || zonesAreOpen} onClick={clickOnGroupZones}>
        <LayerSelector.GroupName data-cy="result-group" title={groupName}>
          {getTitle(groupName) ?? ''}
        </LayerSelector.GroupName>
        <LayerSelector.IconGroup>
          <LayerSelector.ZonesNumber>{`${layerIds.length}/${totalNumberOfZones}`}</LayerSelector.ZonesNumber>

          <IconButton
            accent={Accent.TERTIARY}
            aria-label="Sélectionner la/les zone(s)"
            color={allTopicZonesAreChecked ? THEME.color.blueGray : THEME.color.slateGray}
            Icon={allTopicZonesAreChecked ? Icon.PinFilled : Icon.Pin}
            onClick={handleCheckAllZones}
            title="Sélectionner la/les zone(s)"
          />
        </LayerSelector.IconGroup>
      </LayerSelector.GroupWrapper>
      <LayerSelector.SubGroup isOpen={forceZonesAreOpen || zonesAreOpen} length={layerIds?.length}>
        {layerIds?.map(layerId => (
          <Layer key={layerId} layerId={layerId} />
        ))}
      </LayerSelector.SubGroup>
    </>
  )
}
