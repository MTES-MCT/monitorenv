import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import VectorImageLayer from 'ol/layer/VectorImage'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'

import Layers from '../domain/entities/layers'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../domain/entities/map'
import { getAdministrativeAndRegulatoryLayersStyle } from './styles/administrativeAndRegulatoryLayers.style.js'

export const metadataIsShowedPropertyName = 'metadataIsShowed'
// const SIMPLIFIED_FEATURE_ZOOM_LEVEL = 9.5

const RegulatoryLayers = ({ map }) => {

  const {
    lastShowedFeatures,
    layersToFeatures
  } = useSelector(state => state.layer)

  const {
    regulatoryLayers,
    showedRegulatoryLayerIds,
    regulatoryZoneMetadata,
  } = useSelector(state => state.regulatory)


  useEffect(() => {
    if (map) {
      sortRegulatoryLayersFromAreas(layersToFeatures, map.getLayers().getArray())
    }
  }, [map, layersToFeatures])

  useEffect(() => {
    if (map && showedRegulatoryLayerIds) {
      const olLayers = map.getLayers()
      // remove layers
        olLayers?.getArray().forEach( layer => {
          if (layer.type === Layers.REGULATORY_ENV.code && !showedRegulatoryLayerIds.includes(layer.name)) {
            olLayers.remove(layer)
          }
        })
      // add layers
      const olLayersList = olLayers?.getArray()
      showedRegulatoryLayerIds.forEach(layerId => {
        if (!(olLayersList.some(_layer => _layer.type === Layers.REGULATORY_ENV.code && _layer.name === layerId))) {
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
            source:  vectorSource,
            className: 'regulatory',
            style: getAdministrativeAndRegulatoryLayersStyle(Layers.REGULATORY_ENV.code)
          })
          layerToAdd.name = layerId
          layerToAdd.type = Layers.REGULATORY_ENV.code
          
          olLayers.push(layerToAdd)
        }
      })
    }
  }, [map, regulatoryLayers, showedRegulatoryLayerIds])

  useEffect(() => {
    function addOrRemoveMetadataIsShowedPropertyToShowedRegulatoryLayers () {
      if (map) {
        const regulatoryLayers = map.getLayers().getArray().filter(layer => layer?.name?.includes(Layers.REGULATORY.code))
        if (regulatoryZoneMetadata) {
          const layerToAddProperty = regulatoryLayers.find(layer => {
            return layer?.name === `${Layers.REGULATORY.code}:${regulatoryZoneMetadata.topic}:${regulatoryZoneMetadata.zone}`
          })

          if (layerToAddProperty) {
            addMetadataIsShowedProperty(lastShowedFeatures, layerToAddProperty)
          }
        } else {
          removeMetadataIsShowedProperty(regulatoryLayers)
        }
      }
    }

    addOrRemoveMetadataIsShowedPropertyToShowedRegulatoryLayers()
  }, [map, regulatoryZoneMetadata, lastShowedFeatures])


  return null
}

function sortRegulatoryLayersFromAreas (layersToFeatures, olLayers) {
  const sortedLayersToArea = [...layersToFeatures].sort((a, b) => a.area - b.area).reverse()

  sortedLayersToArea.forEach((layerAndArea, index) => {
    index = index + 1
    const layer = olLayers.find(layer => layer?.name === layerAndArea.name)

    if (layer) {
      layer.setZIndex(index)
    }
  })
}


function addMetadataIsShowedProperty (lastShowedFeatures, layerToAddProperty) {
  const features = layerToAddProperty.getSource().getFeatures()
  if (features?.length) {
    features.forEach(feature => feature.set(metadataIsShowedPropertyName, true))
  } else if (lastShowedFeatures?.length) {
    lastShowedFeatures
      .forEach(feature => feature.set(metadataIsShowedPropertyName, true))
  }
}

function removeMetadataIsShowedProperty (regulatoryLayers) {
  regulatoryLayers.forEach(layer => {
    layer.getSource().getFeatures()
      .filter(feature => feature.get(metadataIsShowedPropertyName))
      .forEach(feature => feature.set(metadataIsShowedPropertyName, false))
  })
}


export default RegulatoryLayers
