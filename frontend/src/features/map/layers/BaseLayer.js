import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { MapboxVector } from 'ol/layer'
import TileLayer from 'ol/layer/Tile'
import { OSM } from 'ol/source'
import XYZ from 'ol/source/XYZ'
import TileWMS from 'ol/source/TileWMS'

import Layers, { baseLayers } from '../../../domain/entities/layers'
import { MAPBOX_KEY, SHOM_KEY } from '../../../env'

const BaseLayer = ({ map }) => {
  let selectedBaseLayer = useSelector(state => state.map.selectedBaseLayer)

  const [baseLayersObjects] = useState({
    LIGHT: () => new MapboxVector({
      styleUrl: 'mapbox://styles/monitorfish/ckrbusml50wgv17nrzy3q374b',
      accessToken: MAPBOX_KEY,
      className: Layers.BASE_LAYER.code,
      zIndex: 0,
      name: baseLayers.LIGHT.code
    }),
    OSM: () => new TileLayer({
      source: new OSM({
        attributions: '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
      }),
      className: Layers.BASE_LAYER.code,
      zIndex: 0,
      name: baseLayers.OSM.code
    }),
    SATELLITE: () => new TileLayer({
      source: new XYZ({
        url: 'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg90?access_token=' + MAPBOX_KEY,
        maxZoom: 19
      }),
      className: Layers.BASE_LAYER.code,
      zIndex: 0,
      name: baseLayers.SATELLITE.code
    }),
    /*
    DARK: () => new MapboxVector({
      styleUrl: 'mapbox://styles/monitorfish/cklv7vc0f1ej817o5ivmkjmrs',
      accessToken: MAPBOX_KEY,
      className: Layers.BASE_LAYER.code,
      zIndex: 0
    }),
    */
    SHOM: () => new TileLayer({
      source: new TileWMS({
        url: `https://services.data.shom.fr/${SHOM_KEY}/wms/r`,
        params: { LAYERS: 'RASTER_MARINE_3857_WMSR', TILED: true },
        serverType: 'geoserver',
        // Countries have transparency, so do not fade tiles:
        transition: 0
      }),
      className: Layers.BASE_LAYER.code,
      zIndex: 0,
      name: baseLayers.SHOM.code
    })
  })

  useEffect(() => {
    function addLayerToMap () {
      if (map) {
        if (!selectedBaseLayer) {
          selectedBaseLayer = baseLayers.OSM.code
        }
        if (baseLayersObjects[selectedBaseLayer]) {
          map.getLayers().push(baseLayersObjects[selectedBaseLayer]())
        }
      }
    }

    addLayerToMap()
  }, [map])

  useEffect(() => {
    function showAnotherBaseLayer () {
      if (map && selectedBaseLayer && baseLayersObjects[selectedBaseLayer]) {
        const olLayers = map.getLayers()
        const layerToRemove = olLayers.getArray()
          .find(layer => layer.className_ === Layers.BASE_LAYER.code)

        if (!layerToRemove) {
          return
        }

        olLayers.insertAt(0, baseLayersObjects[selectedBaseLayer]())
        setTimeout(() => {
          olLayers.remove(layerToRemove)
        }, 300)
      }
    }

    showAnotherBaseLayer()
  }, [selectedBaseLayer])

  return null
}

export default BaseLayer
