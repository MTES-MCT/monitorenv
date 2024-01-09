import { IconButton, Icon, Accent, Size, THEME } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { useState } from 'react'
import Highlighter from 'react-highlight-words'

import { RegulatoryLayer } from './RegulatoryLayer'
import {
  addRegulatoryZonesToMyLayers,
  removeRegulatoryZonesFromMyLayers
} from '../../../../../domain/shared_slices/Regulatory'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { LayerSelector } from '../../../utils/LayerSelector.style'

export function RegulatoryLayerGroup({
  groupName,
  layerIds,
  searchedText
}: {
  groupName: string
  layerIds: number[]
  searchedText: string
}) {
  const dispatch = useAppDispatch()

  const selectedRegulatoryLayerIds = useAppSelector(state => state.regulatory.selectedRegulatoryLayerIds)
  const regulatoryMetadataLayerId = useAppSelector(state => state.regulatoryMetadata.regulatoryMetadataLayerId)
  const totalNumberOfZones = useAppSelector(state => state.regulatory?.regulatoryLayersIdsByName[groupName]?.length)

  const [zonesAreOpen, setZonesAreOpen] = useState(false)
  const zonesSelected = _.intersection(selectedRegulatoryLayerIds, layerIds)
  const forceZonesAreOpen = _.includes(layerIds, regulatoryMetadataLayerId)
  const allTopicZonesAreChecked = zonesSelected?.length === layerIds?.length

  const handleCheckAllZones = e => {
    e.stopPropagation()
    if (allTopicZonesAreChecked) {
      dispatch(removeRegulatoryZonesFromMyLayers(layerIds))
    } else {
      dispatch(addRegulatoryZonesToMyLayers(layerIds))
    }
  }

  return (
    <>
      <LayerSelector.GroupWrapper onClick={() => setZonesAreOpen(!zonesAreOpen)}>
        <LayerSelector.GroupName data-cy="regulatory-layer-topic" title={groupName}>
          <Highlighter
            autoEscape
            highlightClassName="highlight"
            searchWords={searchedText && searchedText.length > 0 ? searchedText.split(' ') : []}
            textToHighlight={groupName || ''}
          />
        </LayerSelector.GroupName>
        <LayerSelector.IconGroup>
          <LayerSelector.ZonesNumber>{`${layerIds.length} / ${totalNumberOfZones}`}</LayerSelector.ZonesNumber>
          <IconButton
            accent={Accent.TERTIARY}
            color={allTopicZonesAreChecked ? THEME.color.blueGray : THEME.color.gunMetal}
            Icon={allTopicZonesAreChecked ? Icon.PinFilled : Icon.Pin}
            onClick={handleCheckAllZones}
            size={Size.NORMAL}
          />
        </LayerSelector.IconGroup>
      </LayerSelector.GroupWrapper>
      <LayerSelector.SubGroup isOpen={forceZonesAreOpen || zonesAreOpen} length={layerIds?.length}>
        {layerIds?.map(layerId => (
          <RegulatoryLayer key={layerId} layerId={layerId} searchedText={searchedText} />
        ))}
      </LayerSelector.SubGroup>
    </>
  )
}
