import { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { setCurrentMapExtentTracker } from '../../domain/shared_slices/Map'

/**
 * Handle browser history on map URL - Note that the map parameter is given from
 * the BaseMap component, even if it's not seen in the props passed to MapHistory
 */
function MapHistory({ map }) {
  const dispatch = useDispatch()
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
  }, [map])

  // init map from url
  useEffect(() => {
    if (map && useViewFromUrl) {
      if (window.location.hash !== '') {
        const hash = window.location.hash.replace('@', '').replace('#', '')
        const viewParts = hash.split(',')
        if (
          viewParts.length === 3 &&
          !Number.isNaN(viewParts[0]) &&
          !Number.isNaN(viewParts[1]) &&
          !Number.isNaN(viewParts[2])
        ) {
          map.getView().setCenter([parseFloat(viewParts[0]), parseFloat(viewParts[1])])
          map.getView().setZoom(parseFloat(viewParts[2]))
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
        const zoom = currentView.getZoom().toFixed(2)
        const view = {
          center,
          zoom
        }

        const url = `#@${center[0].toFixed(2)},${center[1].toFixed(2)},${zoom}`
        window.history.pushState(view, 'map', url)
        const extent = currentView.calculateExtent(map.getSize())
        dispatch(setCurrentMapExtentTracker(extent))
      }
      shouldStoreUrl.current = true
    }

    map.on('moveend', storeViewInHistory)

    return () => map.un('moveend', storeViewInHistory)
  }, [map])

  return null
}

export default MapHistory
