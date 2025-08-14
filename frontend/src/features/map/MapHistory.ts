import { useMapContext } from 'context/map/MapContext'
import _ from 'lodash'
import { memo, useEffect, useState, useRef } from 'react'

import { setCurrentMapExtentTracker } from '../../domain/shared_slices/Map'
import { useAppDispatch } from '../../hooks/useAppDispatch'

/**
 * Handle browser history on map URL - Note that the map parameter is given from
 * the BaseMap component, even if it's not seen in the props passed to MapHistory
 */
export const MapHistory = memo(() => {
  const { map } = useMapContext()

  const dispatch = useAppDispatch()
  const [useViewFromUrl, setUseViewFromUrl] = useState(true)
  const shouldStoreUrl = useRef(true)

  // restore view on browser history navigation
  useEffect(() => {
    const restoreViewOnBrowserHistoryNavigation = event => {
      if (event.state === null) {
        return
      }
      if (map) {
        shouldStoreUrl.current = false
        map.getView().setCenter(event.state.center)
        map.getView().setZoom(event.state.zoom)
        const extent = map.getView().calculateExtent(map.getSize())
        dispatch(setCurrentMapExtentTracker(extent))
      }
    }
    window.addEventListener('popstate', restoreViewOnBrowserHistoryNavigation)

    return () => window.removeEventListener('popstate', restoreViewOnBrowserHistoryNavigation)
  }, [dispatch, map])

  // init map from url
  useEffect(() => {
    if (map && useViewFromUrl) {
      if (window.location.hash !== '') {
        const hash = window.location.hash.replace('@', '').replace('#', '')
        const viewParts = hash.split(',')
        const [lat, lon, zoom] = viewParts
        if (lat && lon && zoom && !Number.isNaN(lat) && !Number.isNaN(lon) && !Number.isNaN(zoom)) {
          map.getView().setCenter([parseFloat(lat), parseFloat(lon)])
          map.getView().setZoom(parseFloat(zoom))
        }
      }
      setUseViewFromUrl(false)
    }
  }, [map, useViewFromUrl])

  // store view in history and in redux store
  useEffect(() => {
    const storeViewInHistory = () => {
      if (map && shouldStoreUrl.current) {
        const currentView = map.getView()
        const center = currentView.getCenter()
        const zoom = currentView?.getZoom()?.toFixed(2)
        const view = {
          center,
          zoom
        }

        const url = _.isArray(center) ? `#@${center[0]?.toFixed(2)},${center[1]?.toFixed(2)},${zoom}` : null
        window.history.pushState(view, 'map', url)
        const extent = currentView.calculateExtent(map.getSize())
        dispatch(setCurrentMapExtentTracker(extent))
      }
      shouldStoreUrl.current = true
    }

    map?.on('moveend', storeViewInHistory)

    return () => map?.un('moveend', storeViewInHistory)
  }, [dispatch, map])

  return null
})
