import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import { getAdministrativeVectorLayer } from '../domain/use_cases/showAdministrativeLayer'
import Layers, { layersType } from '../domain/entities/layers'


const AdministrativeLayers = ({ map }) => {
  const { showedAdministrativeLayerIds } = useSelector(state => state.administrative)

  

  useEffect(() => {
    if (map && showedAdministrativeLayerIds) {
      const olLayers = map.getLayers()
      const olLayersList = olLayers?.getArray()
      if (_.isEmpty(olLayersList)) {
        return
      }
      // remove layers
      olLayersList.forEach( layer => {
        if (layer.type === layersType.ADMINISTRATIVE && !showedAdministrativeLayerIds.includes(layer.name)) {
          olLayers.remove(layer)
        }
      })
      // add layers
      showedAdministrativeLayerIds.forEach(layerId => {
        if (!(olLayersList.some(_layer => _layer.type === Layers.REGULATORY_ENV.code && _layer.name === layerId))) {
          
          const VectorLayer = getAdministrativeVectorLayer(layerId)
          olLayers.push(VectorLayer)
        }
      })
      
    }
  }, [showedAdministrativeLayerIds])

  return null
}

export default AdministrativeLayers
