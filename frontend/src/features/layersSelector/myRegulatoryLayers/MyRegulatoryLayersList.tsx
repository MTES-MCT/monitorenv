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

  const layersByLayersName = useMemo(
    () =>
      groupBy(
        selectedRegulatoryLayers.sort((a, b) => a?.layerName?.localeCompare(b?.layerName)),
        r => r?.layerName
      ),
    [selectedRegulatoryLayers]
  )
  if (isEmpty(selectedRegulatoryLayers)) {
    return (
      <LayerSelector.LayerList
        $baseLayersLength={0}
        $showBaseLayers={myRegulatoryZonesIsOpen}
        data-cy="my-regulatory-layers-list"
      >
        <LayerSelector.NoLayerSelected>Aucune zone sélectionnée</LayerSelector.NoLayerSelected>
      </LayerSelector.LayerList>
    )
  }

  return (
    <LayerSelector.LayerList
      $baseLayersLength={Object.keys(layersByLayersName).length + totalNumberOfZones}
      $showBaseLayers={myRegulatoryZonesIsOpen}
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
  )
}
