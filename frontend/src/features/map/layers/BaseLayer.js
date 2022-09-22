import { MapboxVector } from 'ol/layer'
import TileLayer from 'ol/layer/Tile'
import { OSM } from 'ol/source'
import TileWMS from 'ol/source/TileWMS'
import XYZ from 'ol/source/XYZ'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import Layers, { baseLayers } from '../../../domain/entities/layers'
import { MAPBOX_KEY, SHOM_KEY } from '../../../env'

function BaseLayer({ map }) {
  let selectedBaseLayer = useSelector(state => state.map.selectedBaseLayer)

  const [baseLayersObjects] = useState({
    LIGHT: () =>
      new MapboxVector({
        accessToken: MAPBOX_KEY,
        className: Layers.BASE_LAYER.code,
        name: baseLayers.LIGHT.code,
        styleUrl: 'mapbox://styles/monitorfish/ckrbusml50wgv17nrzy3q374b',
        zIndex: 0
      }),
    OSM: () =>
      new TileLayer({
        className: Layers.BASE_LAYER.code,
        name: baseLayers.OSM.code,
        source: new OSM({
          attributions:
            '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        }),
        zIndex: 0
      }),
    SATELLITE: () =>
      new TileLayer({
        className: Layers.BASE_LAYER.code,
        name: baseLayers.SATELLITE.code,
        source: new XYZ({
          maxZoom: 19,
          url: `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg90?access_token=${MAPBOX_KEY}`
        }),
        zIndex: 0
      }),
    /*
    DARK: () => new MapboxVector({
      styleUrl: 'mapbox://styles/monitorfish/cklv7vc0f1ej817o5ivmkjmrs',
      accessToken: MAPBOX_KEY,
      className: Layers.BASE_LAYER.code,
      zIndex: 0
    }),
    */
    SHOM: () =>
      new TileLayer({
        className: Layers.BASE_LAYER.code,
        name: baseLayers.SHOM.code,
        source: new TileWMS({
          params: { LAYERS: 'RASTER_MARINE_3857_WMSR', TILED: true },
          serverType: 'geoserver',
          // Countries have transparency, so do not fade tiles:
          transition: 0,

          url: `https://services.data.shom.fr/${SHOM_KEY}/wms/r`
        }),
        zIndex: 0
      })
  })

  useEffect(() => {
    function addLayerToMap() {
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
    function showAnotherBaseLayer() {
      if (map && selectedBaseLayer && baseLayersObjects[selectedBaseLayer]) {
        const olLayers = map.getLayers()
        const layerToRemove = olLayers.getArray().find(layer => layer.className_ === Layers.BASE_LAYER.code)

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
