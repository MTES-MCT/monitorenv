import Hammer from 'hammerjs'
import { unByKey } from 'ol/Observable'
import { useEffect } from 'react'

import type { Overlay } from 'ol'
import type { EventsKey } from 'ol/events'
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
    let eventKey: EventsKey

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
    const handlePan = (deltaX, deltaY) =>
      overlay?.setOffset([currentOffset.current[X] + deltaX, currentOffset.current[Y] + deltaY])

    const handlePanEnd = (deltaX, deltaY) => {
      // eslint-disable-next-line no-param-reassign
      currentOffset.current = [currentOffset.current[X] + deltaX, currentOffset.current[Y] + deltaY]
    }
    if (showed && overlay && overlay.getElement()) {
      hammer = new Hammer(overlay.getElement())

      hammer.on('pan', ({ deltaX, deltaY }) => {
        handlePan(deltaX, deltaY)
      })

      hammer.on('panend', ({ deltaX, deltaY }) => {
        handlePanEnd(deltaX, deltaY)
      })
    }

    return () => {
      if (hammer) {
        hammer.off('pan', ({ deltaX, deltaY }) => {
          handlePan(deltaX, deltaY)
        })
        hammer.off('panend', ({ deltaX, deltaY }) => {
          handlePanEnd(deltaX, deltaY)
        })
      }
    }
  }, [showed, overlay, currentOffset])
}
