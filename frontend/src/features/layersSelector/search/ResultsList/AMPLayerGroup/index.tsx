import { IconButton, Icon, Accent, Size } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { useState } from 'react'
import Highlighter from 'react-highlight-words'
import { useDispatch } from 'react-redux'

import { COLORS } from '../../../../../constants/constants'
import { addAmpZonesToMyLayers, removeAmpZonesFromMyLayers } from '../../../../../domain/shared_slices/SelectedAmp'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { LayerSelector } from '../../../utils/LayerSelector.style'
import { AMPLayer } from './AMPLayer'

import type { AMP } from '../../../../../domain/entities/AMPs'

export function AMPLayerGroup({
  groupName,
  groups,
  layerIds,
  searchedText
}: {
  groupName: string
  groups: _.Dictionary<(AMP | undefined)[]>
  layerIds: number[]
  searchedText: string
}) {
  const dispatch = useDispatch()

  const { selectedAmpLayerIds } = useAppSelector(state => state.selectedAmp)
  const totalNumberOfZones = groups[groupName]?.length
  const [zonesAreOpen, setZonesAreOpen] = useState(false)
  const zonesSelected = _.intersection(selectedAmpLayerIds, layerIds)
  const allTopicZonesAreChecked = zonesSelected?.length === layerIds?.length

  const handleCheckAllZones = e => {
    e.stopPropagation()
    if (allTopicZonesAreChecked) {
      dispatch(removeAmpZonesFromMyLayers(layerIds))
    } else {
      dispatch(addAmpZonesToMyLayers(layerIds))
    }
  }

  return (
    <>
      <LayerSelector.GroupWrapper onClick={() => setZonesAreOpen(!zonesAreOpen)}>
        <LayerSelector.GroupName data-cy="amp-layer-topic" title={groupName}>
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
            color={allTopicZonesAreChecked ? COLORS.blueGray : COLORS.gunMetal}
            Icon={allTopicZonesAreChecked ? Icon.PinFilled : Icon.Pin}
            onClick={handleCheckAllZones}
            size={Size.NORMAL}
          />
        </LayerSelector.IconGroup>
      </LayerSelector.GroupWrapper>
      <LayerSelector.SubGroup isOpen={zonesAreOpen} length={layerIds?.length}>
        {layerIds?.map(layerId => (
          <AMPLayer key={layerId} layerId={layerId} searchedText={searchedText} />
        ))}
      </LayerSelector.SubGroup>
    </>
  )
}
