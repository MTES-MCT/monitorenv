import { getDisplayedMetadataRegulatoryLayerId } from '@features/layersSelector/metadataPanel/slice'

import {
  getExtentOfRegulatoryLayersGroupByGroupName,
  getNumberOfRegulatoryLayerZonesByGroupName
} from '../../../../../api/regulatoryLayersAPI'
import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import {
  addRegulatoryZonesToMyLayers,
  removeRegulatoryZonesFromMyLayers
} from '../../../../../domain/shared_slices/Regulatory'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { ResultListLayerGroup } from '../ResultListLayerGroup'

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
  const regulatoryMetadataLayerId = useAppSelector(state => getDisplayedMetadataRegulatoryLayerId(state))
  const totalNumberOfZones = useAppSelector(state => getNumberOfRegulatoryLayerZonesByGroupName(state, groupName))

  const groupExtent = useAppSelector(state => getExtentOfRegulatoryLayersGroupByGroupName(state, groupName))

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
