import _ from 'lodash'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { Layers, layersType } from '../../../domain/entities/layers'
import { getAdministrativeVectorLayer } from '../../../domain/use_cases/administrative/showAdministrativeLayer'

export function AdministrativeLayers({ map }) {
  const { showedAdministrativeLayerIds } = useSelector(state => state.administrative)

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
            _layer => _layer.get('type') === Layers.REGULATORY_ENV.code && _layer.get('name') === layerId
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
