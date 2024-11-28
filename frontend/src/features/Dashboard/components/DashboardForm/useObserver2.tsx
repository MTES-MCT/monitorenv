import { useEffect, useRef, useState } from 'react'

import { useTraceUpdate } from './Columns/FirstColumn'

const createObserver = (root: HTMLElement | null, callback: IntersectionObserverCallback): IntersectionObserver =>
  new IntersectionObserver(callback, {
    root,
    threshold: 1
  })

const observeElements = (
  container: HTMLElement | null,
  observer: IntersectionObserver | undefined,
  element: HTMLElement | null
): (() => void) => {
  if (element && container && observer) {
    observer.observe(element)
  }

  return () => {
    if (element && container && observer) {
      observer.unobserve(element)
    }
  }
}

const checkVisibility = (
  entry: IntersectionObserverEntry,
  state: { orientation: 'top' | 'bottom' | undefined; visible: boolean },
  callBack: (bookmark: { orientation: 'top' | 'bottom' | undefined; visible: boolean }) => void
) => {
  const { boundingClientRect, isIntersecting, rootBounds } = entry
  const isVisible = isIntersecting
  let { orientation } = state

  console.log('check visibility')

  if (!isVisible) {
    if (rootBounds) {
      if (boundingClientRect.bottom < rootBounds.top) {
        orientation = 'top'
      } else if (boundingClientRect.top > rootBounds.bottom) {
        orientation = 'bottom'
      }
    }
  }

  callBack({ orientation, visible: !isVisible })
}

export const useObserver = (containerRef: React.RefObject<HTMLElement>) => {
  const observedRef = useRef(null)
  const [isVisible, setIsVisible] = useState<{ orientation: 'top' | 'bottom' | undefined; visible: boolean }>({
    orientation: undefined,
    visible: false
  })

  useEffect(() => {
    let observer
    if (containerRef.current && observedRef.current) {
      observer = createObserver(containerRef.current, entries => {
        const targetEntry = entries.find(entry => entry.target === observedRef.current)
        if (targetEntry) {
          checkVisibility(targetEntry, isVisible, setIsVisible)
        }
      })
    }

    const cleanup = observeElements(containerRef.current, observer, observedRef.current)

    return cleanup
  }, [containerRef, isVisible])

  return { isVisible, observedRef }
}
