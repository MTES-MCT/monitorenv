import { IconButton, Icon, Accent, Size } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { useState } from 'react'
import Highlighter from 'react-highlight-words'
import { useDispatch } from 'react-redux'

import { COLORS } from '../../../../../constants/constants'
import {
  addRegulatoryZonesToMyLayers,
  removeRegulatoryZonesFromMyLayers
} from '../../../../../domain/shared_slices/Regulatory'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { LayerSelector } from '../../utils/LayerSelector.style'
import { RegulatoryLayer } from './RegulatoryLayer'

export function RegulatoryLayerGroup({
  groupName,
  layerIds,
  searchedText
}: {
  groupName: string
  layerIds: number[]
  searchedText: string
}) {
  const dispatch = useDispatch()

  const { selectedRegulatoryLayerIds } = useAppSelector(state => state.regulatory)
  const { regulatoryMetadataLayerId } = useAppSelector(state => state.regulatoryMetadata)
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
      <LayerSelector.LayerGroup onClick={() => setZonesAreOpen(!zonesAreOpen)}>
        <LayerSelector.LayerGroupName data-cy="regulatory-layer-topic" title={groupName}>
          <Highlighter
            autoEscape
            highlightClassName="highlight"
            searchWords={searchedText && searchedText.length > 0 ? searchedText.split(' ') : []}
            textToHighlight={groupName || ''}
          />
        </LayerSelector.LayerGroupName>
        <LayerSelector.IconGroup>
          <LayerSelector.ZonesNumber>{`${layerIds.length} / ${totalNumberOfZones}`}</LayerSelector.ZonesNumber>
          <IconButton
            accent={Accent.TERTIARY}
            color={allTopicZonesAreChecked ? COLORS.blueYonder : COLORS.gunMetal}
            Icon={allTopicZonesAreChecked ? Icon.PinFilled : Icon.Pin}
            onClick={handleCheckAllZones}
            size={Size.NORMAL}
          />
        </LayerSelector.IconGroup>
      </LayerSelector.LayerGroup>
      <LayerSelector.SubGroup isOpen={forceZonesAreOpen || zonesAreOpen} length={layerIds?.length}>
        {layerIds?.map(layerId => (
          <RegulatoryLayer key={layerId} layerId={layerId} searchedText={searchedText} />
        ))}
      </LayerSelector.SubGroup>
    </>
  )
}
