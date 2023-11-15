import Hammer from 'hammerjs'
import { unByKey } from 'ol/Observable'
import { useEffect } from 'react'

const X = 0
const Y = 1

// TODO Type these params.
export const useMoveOverlayWhenDragging = (
  overlay: any,
  map: any,
  currentOffset: any,
  moveLineWithThrottle: any,
  showed: any
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
    let hammer: HammerManager
    if (showed && overlay && overlay.getElement()) {
      hammer = new Hammer(overlay.getElement())
      hammer.on('pan', ({ deltaX, deltaY }) => {
        overlay.setOffset([currentOffset.current[X] + deltaX, currentOffset.current[Y] + deltaY])
      })

      hammer.on('panend', ({ deltaX, deltaY }) => {
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
