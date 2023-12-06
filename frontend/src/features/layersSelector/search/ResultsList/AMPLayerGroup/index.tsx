import { IconButton, Icon, Accent, Size, THEME } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { useState } from 'react'
import Highlighter from 'react-highlight-words'

import { AMPLayer } from './AMPLayer'
import {
  addAmpZonesToMyLayers,
  removeAmpZonesFromMyLayers,
  setSelectedAmpLayerId
} from '../../../../../domain/shared_slices/SelectedAmp'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { LayerSelector } from '../../../utils/LayerSelector.style'

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
  const dispatch = useAppDispatch()

  const { selectedAmpLayerId, selectedAmpLayerIds } = useAppSelector(state => state.selectedAmp)
  const totalNumberOfZones = groups[groupName]?.length
  const [zonesAreOpen, setZonesAreOpen] = useState(false)
  const zonesSelected = _.intersection(selectedAmpLayerIds, layerIds)
  const allTopicZonesAreChecked = zonesSelected?.length === layerIds?.length
  const forceZonesAreOpen = _.includes(layerIds, selectedAmpLayerId)

  const handleCheckAllZones = e => {
    e.stopPropagation()
    if (allTopicZonesAreChecked) {
      dispatch(removeAmpZonesFromMyLayers(layerIds))
    } else {
      dispatch(addAmpZonesToMyLayers(layerIds))
    }
  }
  const clickOnGroupZones = () => {
    setZonesAreOpen(!zonesAreOpen)
    dispatch(setSelectedAmpLayerId(undefined))
  }

  return (
    <>
      <LayerSelector.GroupWrapper onClick={clickOnGroupZones}>
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
            color={allTopicZonesAreChecked ? THEME.color.blueGray : THEME.color.gunMetal}
            data-cy="amp-layer-topic-pin-button"
            Icon={allTopicZonesAreChecked ? Icon.PinFilled : Icon.Pin}
            onClick={handleCheckAllZones}
            size={Size.NORMAL}
          />
        </LayerSelector.IconGroup>
      </LayerSelector.GroupWrapper>
      <LayerSelector.SubGroup isOpen={zonesAreOpen || forceZonesAreOpen} length={layerIds?.length}>
        {layerIds?.map(layerId => (
          <AMPLayer key={layerId} layerId={layerId} searchedText={searchedText} />
        ))}
      </LayerSelector.SubGroup>
    </>
  )
}
