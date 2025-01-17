import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { find, flatten } from 'lodash'
import GeoJSON from 'ol/format/GeoJSON'
import VectorImageLayer from 'ol/layer/VectorImage'
import { bbox as bboxStrategy } from 'ol/loadingstrategy'
import VectorSource from 'ol/source/Vector'

import { getAdministrativeZoneFromAPI } from '../../../api/administrativeLayersAPI'
import { getAdministrativeLayersStyle } from '../../../features/map/layers/styles/administrativeAndRegulatoryLayers.style'
import { administrativeLayers } from '../../entities/administrativeLayers'
import { LayerType } from '../../entities/layers/constants'

import type { Feature } from 'ol'
import type { Geometry } from 'ol/geom'

const IRRETRIEVABLE_FEATURES_EVENT = 'IRRETRIEVABLE_FEATURES'

const setIrretrievableFeaturesEvent = error => ({
  error,
  type: IRRETRIEVABLE_FEATURES_EVENT
})

export const getAdministrativeVectorLayer = layerId => {
  // TODO Type these `any`.
  const layerDefinition: any = find(flatten(administrativeLayers as any), (l: any) => l.code === layerId)
  const code = layerDefinition?.groupCode || layerDefinition?.code
  const zone = layerDefinition?.groupCode ? layerDefinition?.code : undefined
  const layer = new VectorImageLayer({
    className: 'administrative',
    declutter: true,
    properties: {
      name: layerId,
      type: LayerType.ADMINISTRATIVE
    },
    source: getAdministrativeVectorSourceBBOXStrategy(code, zone),
    style: getAdministrativeLayersStyle(code)
  })

  return layer
}

/**
 *
 * @param {string} code
 * @param {string} subZone
 * @returns
 */
function getAdministrativeVectorSourceBBOXStrategy(code, subZone) {
  const vectorSource = new VectorSource({
    format: new GeoJSON({
      dataProjection: WSG84_PROJECTION,
      featureProjection: OPENLAYERS_PROJECTION
    }),
    loader: extent => {
      getAdministrativeZoneFromAPI(code, extent, subZone)
        .then(administrativeZone => {
          vectorSource.clear(true)
          const features: Feature<Geometry>[] = vectorSource.getFormat()?.readFeatures(administrativeZone) ?? []

          vectorSource.addFeatures(features)
        })
        .catch(e => {
          // TODO Type this `any`.
          vectorSource.dispatchEvent(setIrretrievableFeaturesEvent(e) as any)
          vectorSource.removeLoadedExtent(extent)
        })
    },
    strategy: bboxStrategy
  })

  // TODO Type these `any` (if possible).
  vectorSource.once(IRRETRIEVABLE_FEATURES_EVENT as any, (event: any) => {
    // eslint-disable-next-line no-console
    console.warn(event.error)
  })

  return vectorSource
}
