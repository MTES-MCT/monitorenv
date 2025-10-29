import { addBufferToExtent } from '@features/ControlUnit/utils'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { setMapView } from 'domain/shared_slices/Map'
import { debounce } from 'lodash'
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
      const extentWithMargin = addBufferToExtent(extent4326, 0.2)
      const zoom = view.getZoom()
      const zoomValue = zoom ? Math.floor(zoom) : undefined

      const baseDelta = 1 // tolérance de base
      const zoomFactor = 6 // zoom à partir duquel la tolérance de base est appliquée
      const delta = baseDelta * 2 ** (zoomFactor - (zoomValue || zoomFactor))

      const hasExtentChanged =
        !lastExtentRef.current ||
        Math.abs((extentWithMargin?.[0] ?? 0) - (lastExtentRef.current?.[0] ?? 0)) > delta ||
        Math.abs((extentWithMargin?.[1] ?? 0) - (lastExtentRef.current?.[1] ?? 0)) > delta ||
        Math.abs((extentWithMargin?.[2] ?? 0) - (lastExtentRef.current?.[2] ?? 0)) > delta ||
        Math.abs((extentWithMargin?.[3] ?? 0) - (lastExtentRef.current?.[3] ?? 0)) > delta

      const hasZoomChanged = lastZoomRef.current !== zoomValue
      if (hasExtentChanged || hasZoomChanged) {
        lastExtentRef.current = extentWithMargin
        lastZoomRef.current = zoomValue

        dispatch(setMapView({ bbox: extentWithMargin, zoom: zoomValue }))
      }
    }, 250)

    map.on('moveend', handleMoveEnd)

    handleMoveEnd()

    return () => {
      map.un('moveend', handleMoveEnd)
    }
  }, [map, dispatch])
}
