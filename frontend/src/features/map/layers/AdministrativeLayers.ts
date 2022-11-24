import _ from 'lodash'
import { useEffect } from 'react'

import { layersType } from '../../../domain/entities/layers'
import { getAdministrativeVectorLayer } from '../../../domain/use_cases/administrative/showAdministrativeLayer'
import { useAppSelector } from '../../../hooks/useAppSelector'

export function AdministrativeLayers({ map }) {
  const { showedAdministrativeLayerIds } = useAppSelector(state => state.administrative)

  useEffect(() => {
    if (map && showedAdministrativeLayerIds) {
      const olLayers = map.getLayers()
      const olLayersList = olLayers?.getArray()
      if (_.isEmpty(olLayersList)) {
        return
      }
      // remove layers
      olLayersList.forEach(layer => {
        if (
          layer.get('type') === layersType.ADMINISTRATIVE &&
          !showedAdministrativeLayerIds.includes(layer.get('name'))
        ) {
          olLayers.remove(layer)
        }
      })
      // add layers
      showedAdministrativeLayerIds.forEach(layerId => {
        if (
          !olLayersList.some(
            _layer => _layer.get('type') === layersType.ADMINISTRATIVE && _layer.get('name') === layerId
          )
        ) {
          const VectorLayer = getAdministrativeVectorLayer(layerId)
          olLayers.push(VectorLayer)
        }
      })
    }
  }, [map, showedAdministrativeLayerIds])

  return null
}
