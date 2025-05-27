import { getDisplayedMetadataAMPLayerId } from '@features/layersSelector/metadataPanel/slice'

import { getExtentOfAMPLayersGroupByGroupName, getNumberOfAMPByGroupName } from '../../../../../api/ampsAPI'
import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import { addAmpZonesToMyLayers, removeAmpZonesFromMyLayers } from '../../../../../domain/shared_slices/Amp'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { ResultListLayerGroup } from '../ResultListLayerGroup'

export function AMPLayerGroup({
  groupName,
  layerIds,
  searchedText
}: {
  groupName: string
  layerIds: number[]
  searchedText: string
}) {
  const dispatch = useAppDispatch()
  const selectedAmpLayerIds = useAppSelector(state => state.amp.selectedAmpLayerIds)
  const ampMetadataLayerId = useAppSelector(state => getDisplayedMetadataAMPLayerId(state))
  const totalNumberOfZones = useAppSelector(state => getNumberOfAMPByGroupName(state, groupName))
  const groupExtent = useAppSelector(state => getExtentOfAMPLayersGroupByGroupName(state, groupName))

  const handleAddLayers = ids => dispatch(addAmpZonesToMyLayers(ids))
  const handleRemoveLayers = ids => dispatch(removeAmpZonesFromMyLayers(ids))

  return (
    <ResultListLayerGroup
      addLayers={handleAddLayers}
      groupExtent={groupExtent}
      groupName={groupName}
      layerIds={layerIds}
      layerIdToDisplay={ampMetadataLayerId as number}
      layerType={MonitorEnvLayers.AMP}
      removeLayers={handleRemoveLayers}
      searchedText={searchedText}
      selectedLayerIds={selectedAmpLayerIds}
      totalNumberOfZones={totalNumberOfZones}
    />
  )
}
