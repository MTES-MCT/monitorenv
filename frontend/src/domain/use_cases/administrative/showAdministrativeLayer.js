import _ from 'lodash'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import VectorImageLayer from 'ol/layer/VectorImage'
import { bbox as bboxStrategy } from 'ol/loadingstrategy'

import { layersType } from '../../entities/layers'
import { administrativeLayers } from '../../entities/administrativeLayers'
import { getAdministrativeZoneFromAPI } from '../../../api/administrativeLayersAPI'
import { getAdministrativeAndRegulatoryLayersStyle } from '../../../features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../entities/map'

const IRRETRIEVABLE_FEATURES_EVENT = 'IRRETRIEVABLE_FEATURES'


const setIrretrievableFeaturesEvent = error => {
  return {
    type: IRRETRIEVABLE_FEATURES_EVENT,
    error: error
  }
}

export const getAdministrativeVectorLayer = (layerId) => {
  const layerDefinition = _.find(_.flatten(administrativeLayers), l => l.code === layerId)
  const code = layerDefinition?.groupCode || layerDefinition?.code
  const zone = layerDefinition?.groupCode ? layerDefinition?.code : undefined
  const layer = new VectorImageLayer({
    source: getAdministrativeVectorSourceBBOXStrategy(code, zone),
    className: 'administrative',
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    style: getAdministrativeAndRegulatoryLayersStyle(code),
    declutter: true
  })
  layer.name = layerId
  layer.type = layersType.ADMINISTRATIVE

  return layer
}

/**
 * 
 * @param {string} code 
 * @param {string} subZone 
 * @returns 
 */
function getAdministrativeVectorSourceBBOXStrategy (code, subZone) {
  const vectorSource = new VectorSource({
    format: new GeoJSON({
      dataProjection: WSG84_PROJECTION,
      featureProjection: OPENLAYERS_PROJECTION
    }),
    loader: extent => {
      getAdministrativeZoneFromAPI(code, extent, subZone).then(administrativeZone => {
        vectorSource.clear(true)
        vectorSource.addFeatures(vectorSource.getFormat().readFeatures(administrativeZone))
      }).catch(e => {
        vectorSource.dispatchEvent(setIrretrievableFeaturesEvent(e))
        vectorSource.removeLoadedExtent(extent)
      })
    },
    strategy: bboxStrategy
  })

  vectorSource.once(IRRETRIEVABLE_FEATURES_EVENT, event => {
    console.warn(event.error)
  })

  return vectorSource
}
