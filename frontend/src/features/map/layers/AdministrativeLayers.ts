import { useMapContext } from 'context/map/MapContext'
import { isEmpty } from 'lodash'
import { memo, useEffect } from 'react'

import { LayerType } from '../../../domain/entities/layers/constants'
import { getAdministrativeVectorLayer } from '../../../domain/use_cases/administrative/showAdministrativeLayer'
import { useAppSelector } from '../../../hooks/useAppSelector'

export const AdministrativeLayers = memo(() => {
  const { map } = useMapContext()
  const showedAdministrativeLayerIds = useAppSelector(state => state.administrative.showedAdministrativeLayerIds)

  useEffect(() => {
    if (map && showedAdministrativeLayerIds) {
      const olLayers = map.getLayers()
      const olLayersList = olLayers?.getArray()
      if (isEmpty(olLayersList)) {
        return
      }
      // remove layers
      olLayersList.forEach(layer => {
        if (
          layer.get('type') === LayerType.ADMINISTRATIVE &&
          !showedAdministrativeLayerIds.includes(layer.get('name'))
        ) {
          olLayers.remove(layer)
        }
      })
      // add layers
      showedAdministrativeLayerIds.forEach(layerId => {
        if (
          !olLayersList.some(
            _layer => _layer.get('type') === LayerType.ADMINISTRATIVE && _layer.get('name') === layerId
          )
        ) {
          const VectorLayer = getAdministrativeVectorLayer(layerId)
          olLayers.push(VectorLayer)
        }
      })
    }
  }, [map, showedAdministrativeLayerIds])

  return null
})
