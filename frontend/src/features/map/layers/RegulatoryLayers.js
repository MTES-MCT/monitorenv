import GeoJSON from 'ol/format/GeoJSON'
import VectorImageLayer from 'ol/layer/VectorImage'
import VectorSource from 'ol/source/Vector'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import Layers from '../../../domain/entities/layers'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../domain/entities/map'
import { getAdministrativeAndRegulatoryLayersStyle } from './styles/administrativeAndRegulatoryLayers.style.js'

export const metadataIsShowedPropertyName = 'metadataIsShowed'
// const SIMPLIFIED_FEATURE_ZOOM_LEVEL = 9.5

function RegulatoryLayers({ map }) {
  const { regulatoryLayers, showedRegulatoryLayerIds } = useSelector(state => state.regulatory)

  useEffect(() => {
    if (map && showedRegulatoryLayerIds) {
      const olLayers = map.getLayers()
      // remove layers
      olLayers?.getArray().forEach(layer => {
        if (layer.type === Layers.REGULATORY_ENV.code && !showedRegulatoryLayerIds.includes(layer.name)) {
          olLayers.remove(layer)
        }
      })
      // add layers
      const olLayersList = olLayers?.getArray()
      showedRegulatoryLayerIds.forEach(layerId => {
        if (!olLayersList.some(_layer => _layer.type === Layers.REGULATORY_ENV.code && _layer.name === layerId)) {
          const feature = regulatoryLayers.find(_layer => _layer.id === layerId)
          if (!feature) {
            console.log('TODO: Handle Feature Not Found')

            return
          }
          const vectorSource = new VectorSource({
            format: new GeoJSON({
              dataProjection: WSG84_PROJECTION,
              featureProjection: OPENLAYERS_PROJECTION
            })
          })
          vectorSource.addFeature(vectorSource.getFormat().readFeature(feature))
          const layerToAdd = new VectorImageLayer({
            className: 'regulatory',
            source: vectorSource,
            style: getAdministrativeAndRegulatoryLayersStyle(Layers.REGULATORY_ENV.code)
          })
          layerToAdd.name = layerId
          layerToAdd.type = Layers.REGULATORY_ENV.code

          olLayers.push(layerToAdd)
        }
      })
    }
  }, [map, regulatoryLayers, showedRegulatoryLayerIds])

  return null
}

export default RegulatoryLayers
