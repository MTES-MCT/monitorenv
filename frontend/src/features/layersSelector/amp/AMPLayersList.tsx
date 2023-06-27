import _ from 'lodash'
import { useMemo } from 'react'

import { useGetAMPsQuery } from '../../../api/ampsAPI'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { LayerSelector } from '../utils/LayerSelector.style'
import { AMPLayerGroup } from './AMPLayerGroup'

export function AMPLayersList() {
  const { selectedAmpLayerIds, showedAmpLayerIds } = useAppSelector(state => state.selectedAmp)
  const { currentData: amps } = useGetAMPsQuery()
  const selectedAmps = useMemo(() => selectedAmpLayerIds.map(id => amps?.entities?.[id]), [amps, selectedAmpLayerIds])
  const layersByLayersName = useMemo(() => _.groupBy(selectedAmps, r => r?.name), [selectedAmps])

  if (_.isEmpty(selectedAmpLayerIds)) {
    return (
      <LayerSelector.LayerList>
        <LayerSelector.NoLayerSelected>Aucune zone sélectionnée</LayerSelector.NoLayerSelected>
      </LayerSelector.LayerList>
    )
  }

  return (
    <LayerSelector.LayerList>
      {layersByLayersName &&
        Object.entries(layersByLayersName).map(([layerName, layers]) => (
          <AMPLayerGroup key={layerName} groupName={layerName} layers={layers} showedAmpLayerIds={showedAmpLayerIds} />
        ))}
    </LayerSelector.LayerList>
  )
}
