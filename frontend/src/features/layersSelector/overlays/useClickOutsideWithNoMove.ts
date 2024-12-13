import { useCallback, useEffect, useRef, useState } from 'react'

import type { RefObject } from 'react'
import type { Promisable } from 'type-fest'

type MinimalHtmlElement = Pick<HTMLElement, 'contains'>

export const useClickOutsideWithNoMove = (
  zoneRefOrzoneRefs: RefObject<MinimalHtmlElement | null>,
  action: () => Promisable<void>,
  isActive: boolean
) => {
  const [isDragging, setIsDragging] = useState(false)
  const clickTimer = useRef<NodeJS.Timeout>()

  const onMouseDown = useCallback(
    (event: MouseEvent) => {
      clickTimer.current = undefined
      setIsDragging(false)

      const eventTarget = event.target as Node | null
      const isEventTargetInZone =
        zoneRefOrzoneRefs.current && eventTarget ? zoneRefOrzoneRefs.current.contains(eventTarget) : false

      if (isEventTargetInZone) {
        return
      }

      // Start a timer to differentiate between a single click and a long click
      clickTimer.current = setTimeout(() => {
        setIsDragging(true)
      }, 200)
    },
    [zoneRefOrzoneRefs]
  )

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      setIsDragging(false)
      const eventTarget = event.target as Node | null
      const isEventTargetInZone =
        zoneRefOrzoneRefs.current && eventTarget ? zoneRefOrzoneRefs.current.contains(eventTarget) : false

      if (isEventTargetInZone) {
        return
      }

      if (event.buttons === 1) {
        setIsDragging(true)
      }
    },
    [zoneRefOrzoneRefs]
  )

  const onMouseUp = useCallback(
    (event: MouseEvent) => {
      clearTimeout(clickTimer?.current)

      const eventTarget = event.target as Node | null
      const isEventTargetInZone =
        zoneRefOrzoneRefs.current && eventTarget ? zoneRefOrzoneRefs.current.contains(eventTarget) : false

      if (isEventTargetInZone) {
        return
      }

      if (!isDragging) {
        action()
      }
    },
    [zoneRefOrzoneRefs, action, isDragging]
  )

  useEffect(() => {
    const globalContainer = window.document
    if (!isActive) {
      return () => {
        setTimeout(() => {
          globalContainer.removeEventListener('mousedown', onMouseDown as any)
          globalContainer.removeEventListener('mousemove', onMouseMove as any)
          globalContainer.removeEventListener('mouseup', onMouseUp as any)
        }, 200)
      }
    }

    globalContainer.addEventListener('mousedown', onMouseDown as any)
    globalContainer.addEventListener('mousemove', onMouseMove as any)
    globalContainer.addEventListener('mouseup', onMouseUp as any)

    return () => {
      setTimeout(() => {
        globalContainer.removeEventListener('mousedown', onMouseDown as any)
        globalContainer.removeEventListener('mousemove', onMouseMove as any)
        globalContainer.removeEventListener('mouseup', onMouseUp as any)
      }, 200)
    }
  }, [onMouseDown, onMouseMove, onMouseUp, isActive])
}
