import { getNumberOfAMPByGroupName } from '../../../../../api/ampsAPI'
import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import {
  addAmpZonesToMyLayers,
  removeAmpZonesFromMyLayers,
  setSelectedAmpLayerId
} from '../../../../../domain/shared_slices/SelectedAmp'
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

  const selectedAmpLayerId = useAppSelector(state => state.selectedAmp.selectedAmpLayerId)
  const selectedAmpLayerIds = useAppSelector(state => state.selectedAmp.selectedAmpLayerIds)
  const totalNumberOfZones = useAppSelector(state => getNumberOfAMPByGroupName(state, groupName))

  const handleAddLayers = ids => dispatch(addAmpZonesToMyLayers(ids))
  const handleRemoveLayers = ids => dispatch(removeAmpZonesFromMyLayers(ids))

  const handleClearSelectedLayer = () => {
    dispatch(setSelectedAmpLayerId(undefined))
  }

  return (
    <ResultListLayerGroup
      addLayers={handleAddLayers}
      clearSelectedLayer={handleClearSelectedLayer}
      groupName={groupName}
      layerIds={layerIds}
      layerIdToDisplay={selectedAmpLayerId}
      layerType={MonitorEnvLayers.AMP}
      removeLayers={handleRemoveLayers}
      searchedText={searchedText}
      selectedLayerIds={selectedAmpLayerIds}
      totalNumberOfZones={totalNumberOfZones}
    />
  )
}
