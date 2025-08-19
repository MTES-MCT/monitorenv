import { useMountTransition } from '@hooks/useMountTransition'
import { groupBy, isEmpty } from 'lodash'
import { useMemo, useState } from 'react'

import { MyAMPLayerGroup } from './MyAMPLayerGroup'
import { useGetAMPsQuery } from '../../../api/ampsAPI'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { LayerSelector } from '../utils/LayerSelector.style'

import type { AMP } from '../../../domain/entities/AMPs'

export function AMPLayersList() {
  const selectedAmpLayerIds = useAppSelector(state => state.amp.selectedAmpLayerIds)
  const showedAmpLayerIds = useAppSelector(state => state.amp.showedAmpLayerIds)
  const myAmpsIsOpen = useAppSelector(state => state.layerSidebar.myAmpsIsOpen)

  const [totalNumberOfZones, setTotalNumberOfZones] = useState(0)

  const { currentData: amps, isLoading } = useGetAMPsQuery()
  const selectedAmps = useMemo(
    () => selectedAmpLayerIds.map(id => amps?.entities?.[id]).filter((layer): layer is AMP => !!layer),
    [amps, selectedAmpLayerIds]
  )
  const layersByLayersName = useMemo(
    () =>
      groupBy(
        selectedAmps.sort((a, b) => a?.name?.localeCompare(b?.name)),
        r => r?.name
      ),
    [selectedAmps]
  )
  const hasTransition = useMountTransition(myAmpsIsOpen, 500)
  const layersLength = Object.keys(layersByLayersName).length

  if (isEmpty(selectedAmpLayerIds) && myAmpsIsOpen) {
    return <LayerSelector.NoLayerSelected>Aucune zone sélectionnée</LayerSelector.NoLayerSelected>
  }

  if (isLoading) {
    return <LayerSelector.NoLayerSelected>Chargement en cours</LayerSelector.NoLayerSelected>
  }

  return (
    <>
      {(hasTransition || myAmpsIsOpen) && (
        <LayerSelector.LayerList
          $baseLayersLength={layersLength + totalNumberOfZones}
          $showBaseLayers={hasTransition && myAmpsIsOpen}
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
                    setTotalNumberOfZones={setTotalNumberOfZones}
                    showedAmpLayerIds={showedAmpLayerIds}
                  />
                )
            )}
        </LayerSelector.LayerList>
      )}
    </>
  )
}
