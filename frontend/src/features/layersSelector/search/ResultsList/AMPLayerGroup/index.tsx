import { getNumberOfAMPByGroupName } from '@api/ampsAPI'
import { getDisplayedMetadataAMPLayerId } from '@features/layersSelector/metadataPanel/slice'
import { getExtentOfLayersGroup } from '@features/layersSelector/utils/getExtentOfLayersGroup'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { createEmpty } from 'ol/extent'
import { useMemo } from 'react'

import { MonitorEnvLayers } from '../../../../../domain/entities/layers/constants'
import { addAmpZonesToMyLayers, removeAmpZonesFromMyLayers } from '../../../../../domain/shared_slices/Amp'
import { ResultListLayerGroup } from '../ResultListLayerGroup'

import type { AMP } from '../../../../../domain/entities/AMPs'

export function AMPLayerGroup({
  groupName,
  layers,
  searchedText
}: {
  groupName: string
  layers: AMP[]
  searchedText: string
}) {
  const dispatch = useAppDispatch()
  const selectedAmpLayerIds = useAppSelector(state => state.amp.selectedAmpLayerIds)
  const ampMetadataLayerId = useAppSelector(state => getDisplayedMetadataAMPLayerId(state))
  const totalNumberOfZones = useAppSelector(state => getNumberOfAMPByGroupName(state, groupName))
  const groupExtent = useMemo(() => getExtentOfLayersGroup(layers) ?? createEmpty(), [layers])

  const handleAddLayers = ids => dispatch(addAmpZonesToMyLayers(ids))
  const handleRemoveLayers = ids => dispatch(removeAmpZonesFromMyLayers(ids))

  const hasNewLayers = layers.some(amp => amp.isNew)

  return (
    <ResultListLayerGroup
      addLayers={handleAddLayers}
      groupExtent={groupExtent}
      groupName={groupName}
      hasNewLayers={hasNewLayers}
      layerIdToDisplay={ampMetadataLayerId as number}
      layers={layers}
      layerType={MonitorEnvLayers.AMP}
      removeLayers={handleRemoveLayers}
      searchedText={searchedText}
      selectedLayerIds={selectedAmpLayerIds}
      totalNumberOfZones={totalNumberOfZones}
    />
  )
}
