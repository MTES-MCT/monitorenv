import _ from 'lodash'

import { LayerSelector } from '../../utils/LayerSelector.style'
import { RegulatoryLayerGroup } from './RegulatoryLayerGroup'

export function RegulatoryLayersList({ results }) {
  if (_.isEmpty(results)) {
    return (
      <LayerSelector.LayerList>
        <LayerSelector.NoLayerSelected>Aucune zone sélectionnée</LayerSelector.NoLayerSelected>
      </LayerSelector.LayerList>
    )
  }

  const layersByLayersName = _.groupBy(results, r => r?.properties?.layer_name)

  return (
    <LayerSelector.LayerList>
      {layersByLayersName &&
        Object.entries(layersByLayersName).map(([layerName, layers]) => (
          <RegulatoryLayerGroup key={layerName} groupName={layerName} layers={layers} />
        ))}
    </LayerSelector.LayerList>
  )
}
