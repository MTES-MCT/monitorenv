import _ from 'lodash'

import { RegulatoryLayerGroup } from './MyRegulatoryLayerGroup'
import { getSelectedRegulatoryLayers } from '../../../api/regulatoryLayersAPI'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { LayerSelector } from '../utils/LayerSelector.style'

export function RegulatoryLayersList() {
  const selectedRegulatoryLayers = useAppSelector(state => getSelectedRegulatoryLayers(state))
  const myRegulatoryZonesIsOpen = useAppSelector(state => state.layerSidebar.myRegulatoryZonesIsOpen)

  if (_.isEmpty(selectedRegulatoryLayers)) {
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

  const layersByLayersName = _.groupBy(selectedRegulatoryLayers, r => r?.layer_name)

  return (
    <LayerSelector.LayerList
      $baseLayersLength={Object.keys(layersByLayersName).length}
      $showBaseLayers={myRegulatoryZonesIsOpen}
      data-cy="my-regulatory-layers-list"
    >
      {layersByLayersName &&
        Object.entries(layersByLayersName).map(
          ([layerName, layers]) =>
            !!layers && <RegulatoryLayerGroup key={layerName} groupName={layerName} layers={layers} />
        )}
    </LayerSelector.LayerList>
  )
}
