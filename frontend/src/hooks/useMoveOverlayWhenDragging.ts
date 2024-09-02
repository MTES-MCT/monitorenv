import Hammer from 'hammerjs'
import { unByKey } from 'ol/Observable'
import { useEffect } from 'react'

import type { Overlay } from 'ol'
import type OpenLayerMap from 'ol/Map'

const X = 0
const Y = 1

type Props = {
  currentOffset: { current: number[] }
  map: OpenLayerMap
  moveLineWithThrottle: (target: Overlay, delay: number) => void
  overlay: Overlay | null
  showed: boolean
}

export const useMoveOverlayWhenDragging = ({ currentOffset, map, moveLineWithThrottle, overlay, showed }: Props) => {
  useEffect(() => {
    let eventKey: any

    if (map && overlay) {
      eventKey = overlay.on('change:offset', ({ target }: any) => {
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
