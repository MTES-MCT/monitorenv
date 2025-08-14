import { useMapContext } from 'context/map/MapContext'
import TileLayer from 'ol/layer/Tile'
import { OSM } from 'ol/source'
import TileWMS from 'ol/source/TileWMS'
import XYZ from 'ol/source/XYZ'
import { memo, useEffect, useState } from 'react'

import { Layers } from '../../../domain/entities/layers/constants'
import { useAppSelector } from '../../../hooks/useAppSelector'

export const MapLayer = memo(() => {
  const { map } = useMapContext()
  const selectedBaseLayer = useAppSelector(state => state.map.selectedBaseLayer)

  const [baseLayersObjects] = useState({
    LIGHT: () =>
      new TileLayer({
        className: Layers.BASE_LAYER.code,
        source: new XYZ({
          maxZoom: 19,
          urls: ['a', 'b', 'c', 'd'].map(
            subdomain => `https://${subdomain}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png`
          )
        }),
        zIndex: 0
      }),
    OSM: () =>
      new TileLayer({
        className: Layers.BASE_LAYER.code,
        source: new OSM({
          attributions:
            '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        }),
        zIndex: 0
      }),
    SATELLITE: () =>
      new TileLayer({
        className: Layers.BASE_LAYER.code,
        source: new XYZ({
          maxZoom: 19,
          url: `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg90?access_token=${
            import.meta.env.FRONTEND_MAPBOX_KEY
          }`
        }),
        zIndex: 0
      }),
    SHOM: () =>
      new TileLayer({
        className: Layers.BASE_LAYER.code,
        source: new TileWMS({
          params: { LAYERS: 'RASTER_MARINE_3857_WMSR', TILED: true },
          serverType: 'geoserver',
          // Countries have transparency, so do not fade tiles:
          transition: 0,
          url: `https://services.data.shom.fr/${import.meta.env.FRONTEND_SHOM_KEY}/wms/r`
        }),
        zIndex: 0
      })
  })

  useEffect(() => {
    if (!map || !selectedBaseLayer || !baseLayersObjects[selectedBaseLayer]) {
      return
    }

    function showAnotherBaseLayer() {
      const olLayers = map.getLayers()
      // eslint-disable-next-line no-underscore-dangle
      const layerToRemove = olLayers
        .getArray()
        .find(layer => typeof layer.getClassName === 'function' && layer.getClassName() === Layers.BASE_LAYER.code)

      olLayers.insertAt(0, baseLayersObjects[selectedBaseLayer]())

      if (!layerToRemove) {
        return
      }

      const timeoutId = window.setTimeout(() => {
        olLayers.remove(layerToRemove)
      }, 300)

      // eslint-disable-next-line consistent-return
      return () => {
        window.clearTimeout(timeoutId)
      }
    }

    showAnotherBaseLayer()
  }, [baseLayersObjects, map, selectedBaseLayer])

  return null
})
