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

      // eslint-disable-next-line consistent-return
      return () => {
        if (clickTimer.current) {
          clearTimeout(clickTimer.current)
        }
      }
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
          globalContainer.removeEventListener('mousedown', onMouseDown)
          globalContainer.removeEventListener('mousemove', onMouseMove)
          globalContainer.removeEventListener('mouseup', onMouseUp)
        }, 200)
      }
    }

    globalContainer.addEventListener('mousedown', onMouseDown)
    globalContainer.addEventListener('mousemove', onMouseMove)
    globalContainer.addEventListener('mouseup', onMouseUp)

    return () => {
      setTimeout(() => {
        globalContainer.removeEventListener('mousedown', onMouseDown)
        globalContainer.removeEventListener('mousemove', onMouseMove)
        globalContainer.removeEventListener('mouseup', onMouseUp)
      }, 200)
    }
  }, [onMouseDown, onMouseMove, onMouseUp, isActive])
}
