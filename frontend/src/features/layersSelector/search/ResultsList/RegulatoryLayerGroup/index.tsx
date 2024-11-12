import { getDisplayedMetadataRegulatoryLayerId } from '@features/layersSelector/metadataPanel/slice'
import { MonitorEnvWebWorker } from 'workers/MonitorEnvWebWorker'

import {
  // getExtentOfRegulatoryLayersGroupByGroupName,
  // getNumberOfRegulatoryLayerZonesByGroupName,
  useGetRegulatoryLayersQuery
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

  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()

  const selectedRegulatoryLayerIds = useAppSelector(state => state.regulatory.selectedRegulatoryLayerIds)
  const regulatoryMetadataLayerId = useAppSelector(state => getDisplayedMetadataRegulatoryLayerId(state))
  // const totalNumberOfZones = useAppSelector(state => getNumberOfRegulatoryLayerZonesByGroupName(state, groupName))

  const regulatoryLayersIdsGroupedByName = MonitorEnvWebWorker.getRegulatoryLayersIdsGroupedByName(regulatoryLayers)
  const totalNumberOfZones = regulatoryLayersIdsGroupedByName[groupName]?.length ?? 0

  // const groupExtent = useAppSelector(state => getExtentOfRegulatoryLayersGroupByGroupName(state, groupName))

  const groupExtent = MonitorEnvWebWorker.getExtentOfRegulatoryLayersGroupByGroupName(groupName, regulatoryLayers)

  const handleAddLayers = ids => dispatch(addRegulatoryZonesToMyLayers(ids))
  const handleRemoveLayers = ids => dispatch(removeRegulatoryZonesFromMyLayers(ids))

  return (
    <ResultListLayerGroup
      addLayers={handleAddLayers}
      groupExtent={groupExtent}
      groupName={groupName}
      layerIds={layerIds}
      layerIdToDisplay={regulatoryMetadataLayerId}
      layerType={MonitorEnvLayers.REGULATORY_ENV}
      removeLayers={handleRemoveLayers}
      searchedText={searchedText}
      selectedLayerIds={selectedRegulatoryLayerIds}
      totalNumberOfZones={totalNumberOfZones}
    />
  )
}
