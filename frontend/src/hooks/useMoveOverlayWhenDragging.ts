import Hammer from 'hammerjs'
import { unByKey } from 'ol/Observable'
import { useEffect, type MutableRefObject } from 'react'

import type { Overlay } from 'ol'
import type { Coordinate } from 'ol/coordinate'
import type OpenLayerMap from 'ol/Map'

const X = 0
const Y = 1

export const useMoveOverlayWhenDragging = (
  overlay: Overlay | null,
  map: OpenLayerMap,
  currentOffset: MutableRefObject<Coordinate>,
  moveLineWithThrottle,
  showed: boolean
) => {
  useEffect(() => {
    let eventKey

    if (map && overlay) {
      eventKey = overlay.on('change:offset', ({ target }) => {
        moveLineWithThrottle(target, 50)
      })
    }

    return () => {
      if (eventKey) {
        unByKey(eventKey)
      }
    }
  }, [overlay, map, moveLineWithThrottle])

  useEffect(() => {
    let hammer
    if (showed && overlay && overlay.getElement()) {
      hammer = new Hammer(overlay.getElement())
      hammer.on('pan', ({ deltaX, deltaY }) => {
        overlay.setOffset([currentOffset.current[X] + deltaX, currentOffset.current[Y] + deltaY])
      })

      hammer.on('panend', ({ deltaX, deltaY }) => {
        // TODO Remove this re-assigment.
        // eslint-disable-next-line no-param-reassign
        currentOffset.current = [currentOffset.current[X] + deltaX, currentOffset.current[Y] + deltaY]
      })
    }

    return () => {
      if (hammer) {
        hammer.off('pan')
        hammer.off('panend')
      }
    }
  }, [showed, overlay, currentOffset])
}
