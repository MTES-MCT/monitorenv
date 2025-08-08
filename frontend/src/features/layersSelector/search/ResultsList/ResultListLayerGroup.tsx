import {
  getIsLinkingAMPToVigilanceArea,
  getIsLinkingZonesToVigilanceArea,
  vigilanceAreaActions
} from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { getTitle } from 'domain/entities/layers/utils'
import { setFitToExtent } from 'domain/shared_slices/Map'
import { difference, includes, intersection } from 'lodash'
import { useCallback, useState } from 'react'
import Highlighter from 'react-highlight-words'

import { AMPLayer } from './AMPLayerGroup/AMPLayer'
import { RegulatoryLayer } from './RegulatoryLayerGroup/RegulatoryLayer'
import { MonitorEnvLayers } from '../../../../domain/entities/layers/constants'
import { LayerSelector } from '../../utils/LayerSelector.style'

type ResultListLayerGroupProps = {
  addLayers: (layerIds: number[]) => void
  groupExtent: number[]
  groupName: string
  layerIdToDisplay: number | undefined
  layerIds: number[]
  layerType: MonitorEnvLayers.REGULATORY_ENV | MonitorEnvLayers.AMP | MonitorEnvLayers.VIGILANCE_AREA
  removeLayers: (layerIds: number[]) => void
  searchedText: string
  selectedLayerIds: number[]
  totalNumberOfZones: number
}
export function ResultListLayerGroup({
  addLayers,
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

  const zonesSelected = intersection(selectedLayerIds, layerIds)
  const allTopicZonesAreChecked = zonesSelected?.length === layerIds?.length
  const forceZonesAreOpen = includes(layerIds, layerIdToDisplay)

  const regulatoryAreasLinkedToVigilanceAreaForm = useAppSelector(state => state.vigilanceArea.regulatoryAreasToAdd)
  const AMPLinkedToVigilanceAreaForm = useAppSelector(state => state.vigilanceArea.ampToAdd)

  const isLinkingAMPToVigilanceArea = useAppSelector(state => getIsLinkingAMPToVigilanceArea(state))
  const isLinkingZonesToVigilanceArea = useAppSelector(state => getIsLinkingZonesToVigilanceArea(state))

  const isLayerGroupDisabled =
    difference(layerIds, regulatoryAreasLinkedToVigilanceAreaForm).length === 0 ||
    difference(layerIds, AMPLinkedToVigilanceAreaForm).length === 0

  const handleCheckAllZones = useCallback(
    e => {
      e.stopPropagation()
      if (allTopicZonesAreChecked) {
        removeLayers(layerIds)
      } else {
        addLayers(layerIds)
      }
    },
    [allTopicZonesAreChecked, addLayers, layerIds, removeLayers]
  )

  const clickOnGroupZones = useCallback(() => {
    setZonesAreOpen(!zonesAreOpen)

    if (!zonesAreOpen) {
      dispatch(setFitToExtent(groupExtent))
    }
  }, [dispatch, groupExtent, zonesAreOpen])

  const addZonesToVigilanceArea = useCallback(() => {
    if (isLinkingAMPToVigilanceArea) {
      dispatch(vigilanceAreaActions.addAmpIdsToVigilanceArea(layerIds))

      return
    }
    dispatch(vigilanceAreaActions.addRegulatoryAreasToVigilanceArea(layerIds))
  }, [dispatch, isLinkingAMPToVigilanceArea, layerIds])

  return (
    <>
      <LayerSelector.GroupWrapper $isOpen={forceZonesAreOpen || zonesAreOpen} onClick={clickOnGroupZones}>
        <LayerSelector.GroupName data-cy="result-group" title={groupName}>
          <Highlighter
            autoEscape
            highlightClassName="highlight"
            searchWords={searchedText && searchedText.length > 0 ? searchedText.split(' ') : []}
            textToHighlight={getTitle(groupName) ?? ''}
          />
        </LayerSelector.GroupName>
        <LayerSelector.IconGroup>
          <LayerSelector.ZonesNumber>{`${layerIds.length}/${totalNumberOfZones}`}</LayerSelector.ZonesNumber>
          {isLinkingZonesToVigilanceArea ? (
            <IconButton
              accent={Accent.TERTIARY}
              disabled={isLayerGroupDisabled}
              Icon={Icon.Plus}
              onClick={addZonesToVigilanceArea}
              title="Ajouter la/les zone(s) à la zone de vigilance"
            />
          ) : (
            <IconButton
              accent={Accent.TERTIARY}
              color={allTopicZonesAreChecked ? THEME.color.blueGray : THEME.color.gunMetal}
              Icon={allTopicZonesAreChecked ? Icon.PinFilled : Icon.Pin}
              onClick={handleCheckAllZones}
              title="Sélectionner la/les zone(s)"
            />
          )}
        </LayerSelector.IconGroup>
      </LayerSelector.GroupWrapper>
      <LayerSelector.SubGroup $isOpen={forceZonesAreOpen || zonesAreOpen} $length={layerIds?.length}>
        {layerType === MonitorEnvLayers.REGULATORY_ENV &&
          layerIds?.map(layerId => <RegulatoryLayer key={layerId} layerId={layerId} searchedText={searchedText} />)}
        {layerType === MonitorEnvLayers.AMP &&
          layerIds?.map(layerId => <AMPLayer key={layerId} layerId={layerId} searchedText={searchedText} />)}
      </LayerSelector.SubGroup>
    </>
  )
}
