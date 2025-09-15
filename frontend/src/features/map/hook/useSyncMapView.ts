import { useAppDispatch } from '@hooks/useAppDispatch'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { setMapView } from 'domain/shared_slices/Map'
import { debounce, isEqual } from 'lodash'
import { transformExtent } from 'ol/proj'
import { useEffect, useRef } from 'react'

import type { Extent } from 'ol/extent'
import type OpenLayerMap from 'ol/Map'

export const useSyncMapViewToRedux = (map: OpenLayerMap | undefined) => {
  const dispatch = useAppDispatch()

  const lastExtentRef = useRef<Extent | undefined>(undefined)
  const lastZoomRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!map) {
      return undefined
    }

    const view = map.getView()

    const handleMoveEnd = debounce(() => {
      const extent3857 = view.calculateExtent(map.getSize())
      const extent4326 = transformExtent(extent3857, OPENLAYERS_PROJECTION, WSG84_PROJECTION)
      const zoom = view.getZoom()
      const zoomValue = zoom ? Math.floor(zoom) : undefined

      const hasExtentChanged = !isEqual(lastExtentRef.current, extent4326)
      const hasZoomChanged = lastZoomRef.current !== zoomValue

      if (hasExtentChanged || hasZoomChanged) {
        lastExtentRef.current = extent4326
        lastZoomRef.current = zoomValue

        dispatch(setMapView({ bbox: extent4326, zoom: zoomValue }))
      }
    }, 250)

    map.on('moveend', handleMoveEnd)

    handleMoveEnd()

    return () => {
      map.un('moveend', handleMoveEnd)
    }
  }, [map, dispatch])
}
