import _ from 'lodash'
import { useMemo } from 'react'

import { AMPLayerGroup } from './AMPLayerGroup'
import { useGetAMPsQuery } from '../../../api/ampsAPI'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { LayerSelector } from '../utils/LayerSelector.style'

import type { AMP } from '../../../domain/entities/AMPs'

export function AMPLayersList() {
  const selectedAmpLayerIds = useAppSelector(state => state.selectedAmp.selectedAmpLayerIds)
  const showedAmpLayerIds = useAppSelector(state => state.selectedAmp.showedAmpLayerIds)

  const { currentData: amps, isLoading } = useGetAMPsQuery()
  const selectedAmps = useMemo(
    () => selectedAmpLayerIds.map(id => amps?.entities?.[id]).filter((l): l is AMP => !!l),
    [amps, selectedAmpLayerIds]
  )
  const layersByLayersName = useMemo(() => _.groupBy(selectedAmps, r => r?.name), [selectedAmps])

  if (_.isEmpty(selectedAmpLayerIds)) {
    return (
      <LayerSelector.LayerList>
        <LayerSelector.NoLayerSelected>Aucune zone sélectionnée</LayerSelector.NoLayerSelected>
      </LayerSelector.LayerList>
    )
  }

  if (isLoading) {
    return (
      <LayerSelector.LayerList>
        <LayerSelector.NoLayerSelected>Chargement en cours</LayerSelector.NoLayerSelected>
      </LayerSelector.LayerList>
    )
  }

  return (
    <LayerSelector.LayerList data-cy="amp-my-zones-list">
      {layersByLayersName &&
        Object.entries(layersByLayersName).map(
          ([layerName, layers]) =>
            layers!! && (
              <AMPLayerGroup
                key={layerName}
                groupName={layerName}
                layers={layers}
                showedAmpLayerIds={showedAmpLayerIds}
              />
            )
        )}
    </LayerSelector.LayerList>
  )
}
