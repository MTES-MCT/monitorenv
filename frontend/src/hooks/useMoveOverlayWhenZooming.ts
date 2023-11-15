import { useEffect } from 'react'

export const useMoveOverlayWhenZooming = (
  overlay,
  initialOffsetValue,
  zoomHasChanged,
  currentOffset,
  moveWithThrottle
) => {
  useEffect(
    () => {
      if (currentOffset && currentOffset.current !== initialOffsetValue) {
        moveWithThrottle(overlay, 50)
      }
    },

    // TODO Check that this is correct.
    // `React Hook useEffect has missing dependencies: 'currentOffset', 'initialOffsetValue', 'moveWithThrottle', and 'overlay'.`
    [zoomHasChanged]
  )
}
