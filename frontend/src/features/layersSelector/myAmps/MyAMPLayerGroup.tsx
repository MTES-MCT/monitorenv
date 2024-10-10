import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { intersection } from 'lodash'

import { MyAMPLayerZone } from './MyAMPLayerZone'
import { getNumberOfAMPByGroupName } from '../../../api/ampsAPI'
import { hideAmpLayers, removeAmpZonesFromMyLayers, showAmpLayer } from '../../../domain/shared_slices/Amp'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { getExtentOfLayersGroup } from '../utils/getExtentOfLayersGroup'
import { MyLayerGroup } from '../utils/MyLayerGroup'

import type { AMP } from '../../../domain/entities/AMPs'

export function MyAMPLayerGroup({
  groupName,
  layers,
  setTotalNumberOfZones,
  showedAmpLayerIds
}: {
  groupName: string
  layers: AMP[]
  setTotalNumberOfZones: (totalNumberOfZones: number) => void
  showedAmpLayerIds: number[]
}) {
  const dispatch = useAppDispatch()
  const totalNumberOfZones = useAppSelector(state => getNumberOfAMPByGroupName(state, groupName))

  const groupLayerIds = layers.map(l => l.id)
  const ampZonesAreShowed = intersection(groupLayerIds, showedAmpLayerIds).length > 0

  const ampLinkedToVigilanceAreaForm = useAppSelector(state => state.vigilanceArea.ampToAdd)

  const fitToGroupExtent = () => {
    const extent = getExtentOfLayersGroup(layers)
    dispatch(setFitToExtent(extent))
  }

  const handleRemoveZone = e => {
    e.stopPropagation()
    dispatch(removeAmpZonesFromMyLayers(groupLayerIds))
  }

  const toggleLayerDisplay = e => {
    e.stopPropagation()
    if (ampZonesAreShowed) {
      dispatch(hideAmpLayers(groupLayerIds))
    } else {
      fitToGroupExtent()
      dispatch(showAmpLayer(groupLayerIds))
    }
  }

  const addZonesToVigilanceArea = () => {
    dispatch(vigilanceAreaActions.addAmpIdsToVigilanceArea(groupLayerIds))
  }

  return (
    <MyLayerGroup
      addZonesToVigilanceArea={addZonesToVigilanceArea}
      groupName={groupName}
      layers={layers}
      name="amp"
      onRemoveZone={e => handleRemoveZone(e)}
      setTotalNumberOfZones={setTotalNumberOfZones}
      toggleLayerDisplay={toggleLayerDisplay}
      totalNumberOfZones={totalNumberOfZones}
      zonesAreShowed={ampZonesAreShowed}
      zonesLinkedToVigilanceArea={ampLinkedToVigilanceAreaForm}
    >
      {layers?.map(layer => (
        <MyAMPLayerZone key={layer.id} amp={layer} isDisplayed={showedAmpLayerIds.includes(layer.id)} />
      ))}
    </MyLayerGroup>
  )
}
