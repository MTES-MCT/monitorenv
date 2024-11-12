import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { getTitle } from 'domain/entities/layers/utils'
import { intersection } from 'lodash'
import { MonitorEnvWebWorker } from 'workers/MonitorEnvWebWorker'

import { RegulatoryLayerZone } from './MyRegulatoryLayerZone'
import { useGetRegulatoryLayersQuery } from '../../../api/regulatoryLayersAPI'
import { setFitToExtent } from '../../../domain/shared_slices/Map'
import {
  hideRegulatoryLayers,
  removeRegulatoryZonesFromMyLayers,
  showRegulatoryLayer
} from '../../../domain/shared_slices/Regulatory'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { getExtentOfLayersGroup } from '../utils/getExtentOfLayersGroup'
import { MyLayerGroup } from '../utils/MyLayerGroup'

import type { RegulatoryLayerCompact } from '../../../domain/entities/regulatory'

export function RegulatoryLayerGroup({
  groupName,
  layers,
  setTotalNumberOfZones
}: {
  groupName: string
  layers: RegulatoryLayerCompact[]
  setTotalNumberOfZones: (totalNumberOfZones: number) => void
}) {
  const dispatch = useAppDispatch()
  const groupLayerIds = layers.map(l => l.id)
  const showedRegulatoryLayerIds = useAppSelector(state => state.regulatory.showedRegulatoryLayerIds)

  const regulatoryZonesAreShowed = intersection(groupLayerIds, showedRegulatoryLayerIds).length > 0
  // const totalNumberOfZones = useAppSelector(state => getNumberOfRegulatoryLayerZonesByGroupName(state, groupName))

  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const regulatoryLayersIdsGroupedByName = MonitorEnvWebWorker.getRegulatoryLayersIdsGroupedByName(regulatoryLayers)
  const totalNumberOfZones = regulatoryLayersIdsGroupedByName[groupName]?.length ?? 0

  const regulatoryAreasLinkedToVigilanceAreaForm = useAppSelector(state => state.vigilanceArea.regulatoryAreasToAdd)

  const handleRemoveZone = e => {
    e.stopPropagation()
    dispatch(removeRegulatoryZonesFromMyLayers(groupLayerIds))
  }

  const toggleLayerDisplay = e => {
    e.stopPropagation()
    if (regulatoryZonesAreShowed) {
      dispatch(hideRegulatoryLayers(groupLayerIds))
    } else {
      const extent = getExtentOfLayersGroup(layers)
      dispatch(setFitToExtent(extent))
      dispatch(showRegulatoryLayer(groupLayerIds))
    }
  }

  const addZonesToVigilanceArea = () => {
    dispatch(vigilanceAreaActions.addRegulatoryAreasToVigilanceArea(groupLayerIds))
  }

  return (
    <MyLayerGroup
      addZonesToVigilanceArea={addZonesToVigilanceArea}
      groupName={getTitle(groupName)}
      layers={layers}
      name="regulatory"
      onRemoveZone={e => handleRemoveZone(e)}
      setTotalNumberOfZones={setTotalNumberOfZones}
      toggleLayerDisplay={toggleLayerDisplay}
      totalNumberOfZones={totalNumberOfZones}
      zonesAreShowed={regulatoryZonesAreShowed}
      zonesLinkedToVigilanceArea={regulatoryAreasLinkedToVigilanceAreaForm}
    >
      {layers?.map(regulatoryZone => (
        <RegulatoryLayerZone key={regulatoryZone.id} regulatoryZone={regulatoryZone} />
      ))}
    </MyLayerGroup>
  )
}
