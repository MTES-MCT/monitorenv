import _ from 'lodash'
import { useMemo } from 'react'

import { MyAMPLayerGroup } from './MyAMPLayerGroup'
import { useGetAMPsQuery } from '../../../api/ampsAPI'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { LayerSelector } from '../utils/LayerSelector.style'

import type { AMP } from '../../../domain/entities/AMPs'

export function AMPLayersList() {
  const selectedAmpLayerIds = useAppSelector(state => state.amp.selectedAmpLayerIds)
  const showedAmpLayerIds = useAppSelector(state => state.amp.showedAmpLayerIds)
  const myAmpsIsOpen = useAppSelector(state => state.layerSidebar.myAmpsIsOpen)

  const { currentData: amps, isLoading } = useGetAMPsQuery()
  const selectedAmps = useMemo(
    () => selectedAmpLayerIds.map(id => amps?.entities?.[id]).filter((layer): layer is AMP => !!layer),
    [amps, selectedAmpLayerIds]
  )
  const layersByLayersName = useMemo(() => _.groupBy(selectedAmps, r => r?.name), [selectedAmps])

  if (_.isEmpty(selectedAmpLayerIds)) {
    return (
      <LayerSelector.LayerList $baseLayersLength={0} $showBaseLayers={myAmpsIsOpen}>
        <LayerSelector.NoLayerSelected>Aucune zone sélectionnée</LayerSelector.NoLayerSelected>
      </LayerSelector.LayerList>
    )
  }

  if (isLoading) {
    return (
      <LayerSelector.LayerList $baseLayersLength={0} $showBaseLayers={myAmpsIsOpen}>
        <LayerSelector.NoLayerSelected>Chargement en cours</LayerSelector.NoLayerSelected>
      </LayerSelector.LayerList>
    )
  }

  return (
    <LayerSelector.LayerList
      $baseLayersLength={Object.keys(layersByLayersName).length}
      $showBaseLayers={myAmpsIsOpen}
      data-cy="my-amp-zones-list"
    >
      {layersByLayersName &&
        Object.entries(layersByLayersName).map(
          ([layerName, layers]) =>
            layers!! && (
              <MyAMPLayerGroup
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
