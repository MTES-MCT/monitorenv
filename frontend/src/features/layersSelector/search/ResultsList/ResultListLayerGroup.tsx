import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { setFitToExtent } from 'domain/shared_slices/Map'
import _ from 'lodash'
import { useState } from 'react'
import Highlighter from 'react-highlight-words'

import { AMPLayer } from './AMPLayerGroup/AMPLayer'
import { RegulatoryLayer } from './RegulatoryLayerGroup/RegulatoryLayer'
import { MonitorEnvLayers } from '../../../../domain/entities/layers/constants'
import { LayerSelector } from '../../utils/LayerSelector.style'

type ResultListLayerGroupProps = {
  addLayers: (layerIds: number[]) => void
  clearSelectedLayer?: () => void
  groupExtent: number[]
  groupName: string
  layerIdToDisplay: number | undefined
  layerIds: number[]
  layerType: MonitorEnvLayers.REGULATORY_ENV | MonitorEnvLayers.AMP
  removeLayers: (layerIds: number[]) => void
  searchedText: string
  selectedLayerIds: number[]
  totalNumberOfZones: number
}
export function ResultListLayerGroup({
  addLayers,
  clearSelectedLayer,
  groupExtent,
  groupName,
  layerIds,
  layerIdToDisplay,
  layerType,
  removeLayers,
  searchedText,
  selectedLayerIds,
  totalNumberOfZones
}: ResultListLayerGroupProps) {
  const dispatch = useAppDispatch()
  const [zonesAreOpen, setZonesAreOpen] = useState(false)

  const zonesSelected = _.intersection(selectedLayerIds, layerIds)
  const allTopicZonesAreChecked = zonesSelected?.length === layerIds?.length
  const forceZonesAreOpen = _.includes(layerIds, layerIdToDisplay)

  const handleCheckAllZones = e => {
    e.stopPropagation()
    if (allTopicZonesAreChecked) {
      removeLayers(layerIds)
    } else {
      addLayers(layerIds)
    }
  }

  const clickOnGroupZones = () => {
    setZonesAreOpen(!zonesAreOpen)

    if (!zonesAreOpen) {
      dispatch(setFitToExtent(groupExtent))
    }
    if (clearSelectedLayer) {
      clearSelectedLayer()
    }
  }

  return (
    <>
      <LayerSelector.GroupWrapper $isOpen={forceZonesAreOpen || zonesAreOpen} onClick={clickOnGroupZones}>
        <LayerSelector.GroupName data-cy="result-group" title={groupName}>
          <Highlighter
            autoEscape
            highlightClassName="highlight"
            searchWords={searchedText && searchedText.length > 0 ? searchedText.split(' ') : []}
            textToHighlight={groupName ?? ''}
          />
        </LayerSelector.GroupName>
        <LayerSelector.IconGroup>
          <LayerSelector.ZonesNumber>{`${layerIds.length} / ${totalNumberOfZones}`}</LayerSelector.ZonesNumber>
          <IconButton
            accent={Accent.TERTIARY}
            aria-label="Sélectionner la/les zone(s)"
            color={allTopicZonesAreChecked ? THEME.color.blueGray : THEME.color.gunMetal}
            Icon={allTopicZonesAreChecked ? Icon.PinFilled : Icon.Pin}
            onClick={handleCheckAllZones}
            title="Sélectionner la/les zone(s)"
          />
        </LayerSelector.IconGroup>
      </LayerSelector.GroupWrapper>
      <LayerSelector.SubGroup isOpen={forceZonesAreOpen || zonesAreOpen} length={layerIds?.length}>
        {layerType === MonitorEnvLayers.REGULATORY_ENV &&
          layerIds?.map(layerId => <RegulatoryLayer key={layerId} layerId={layerId} searchedText={searchedText} />)}
        {layerType === MonitorEnvLayers.AMP &&
          layerIds?.map(layerId => <AMPLayer key={layerId} layerId={layerId} searchedText={searchedText} />)}
      </LayerSelector.SubGroup>
    </>
  )
}
