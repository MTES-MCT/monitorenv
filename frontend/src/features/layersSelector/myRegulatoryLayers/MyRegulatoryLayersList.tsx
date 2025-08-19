import { useMountTransition } from '@hooks/useMountTransition'
import { groupBy, isEmpty } from 'lodash'
import { useMemo, useState } from 'react'

import { RegulatoryLayerGroup } from './MyRegulatoryLayerGroup'
import { getSelectedRegulatoryLayers } from '../../../api/regulatoryLayersAPI'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { LayerSelector } from '../utils/LayerSelector.style'

export function RegulatoryLayersList() {
  const selectedRegulatoryLayers = useAppSelector(state => getSelectedRegulatoryLayers(state))
  const myRegulatoryZonesIsOpen = useAppSelector(state => state.layerSidebar.myRegulatoryZonesIsOpen)

  const [totalNumberOfZones, setTotalNumberOfZones] = useState(0)
  const hasTransition = useMountTransition(myRegulatoryZonesIsOpen, 500)

  const layersByLayersName = useMemo(
    () =>
      groupBy(
        selectedRegulatoryLayers.sort((a, b) => a?.layerName?.localeCompare(b?.layerName)),
        r => r?.layerName
      ),
    [selectedRegulatoryLayers]
  )
  if (isEmpty(selectedRegulatoryLayers) && myRegulatoryZonesIsOpen) {
    return <LayerSelector.NoLayerSelected>Aucune zone sélectionnée</LayerSelector.NoLayerSelected>
  }

  return (
    <>
      {(hasTransition || myRegulatoryZonesIsOpen) && (
        <LayerSelector.LayerList
          $baseLayersLength={Object.keys(layersByLayersName).length + totalNumberOfZones}
          $showBaseLayers={hasTransition && myRegulatoryZonesIsOpen}
          data-cy="my-regulatory-layers-list"
        >
          {layersByLayersName &&
            Object.entries(layersByLayersName).map(
              ([layerName, layers]) =>
                !!layers && (
                  <RegulatoryLayerGroup
                    key={layerName}
                    groupName={layerName}
                    layers={layers}
                    setTotalNumberOfZones={setTotalNumberOfZones}
                  />
                )
            )}
        </LayerSelector.LayerList>
      )}
    </>
  )
}
