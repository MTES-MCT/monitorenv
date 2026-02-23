import { useGetLayerNamesQuery } from '@api/regulatoryAreasAPI'
import { getDisplayedMetadataRegulatoryLayerId } from '@features/layersSelector/metadataPanel/slice'
import { getExtentOfLayersGroup } from '@features/layersSelector/utils/getExtentOfLayersGroup'
import { createEmpty } from 'ol/extent'
import { useMemo } from 'react'

import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import {
  addRegulatoryZonesToMyLayers,
  removeRegulatoryZonesFromMyLayers
} from '../../../../../domain/shared_slices/Regulatory'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { ResultListLayerGroup } from '../ResultListLayerGroup'

import type { RegulatoryArea } from '@features/RegulatoryArea/types'

export function RegulatoryLayerGroup({
  groupName,
  layers,
  searchedText
}: {
  groupName: string
  layers: RegulatoryArea.RegulatoryAreaWithBbox[]
  searchedText: string
}) {
  const dispatch = useAppDispatch()
  const { data: regulatoryAreasLayerNames } = useGetLayerNamesQuery()

  const selectedRegulatoryLayerIds = useAppSelector(state => state.regulatory.selectedRegulatoryLayerIds)
  const regulatoryMetadataLayerId = useAppSelector(state => getDisplayedMetadataRegulatoryLayerId(state))

  const totalNumberOfZones = useMemo(
    () => regulatoryAreasLayerNames?.layerNames[groupName] ?? 0,
    [regulatoryAreasLayerNames, groupName]
  )
  const groupExtent = useMemo(() => getExtentOfLayersGroup(layers) ?? createEmpty(), [layers])
  const layerIds = useMemo(() => layers.map(layer => layer.id), [layers])

  const handleAddLayers = ids => dispatch(addRegulatoryZonesToMyLayers(ids))
  const handleRemoveLayers = ids => dispatch(removeRegulatoryZonesFromMyLayers(ids))

  return (
    <ResultListLayerGroup
      addLayers={handleAddLayers}
      groupExtent={groupExtent}
      groupName={groupName}
      layerIds={layerIds}
      layerIdToDisplay={regulatoryMetadataLayerId as number}
      layerType={MonitorEnvLayers.REGULATORY_ENV}
      removeLayers={handleRemoveLayers}
      searchedText={searchedText}
      selectedLayerIds={selectedRegulatoryLayerIds}
      totalNumberOfZones={totalNumberOfZones}
    />
  )
}
