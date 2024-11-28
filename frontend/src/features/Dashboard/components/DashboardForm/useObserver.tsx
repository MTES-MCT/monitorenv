import { useCallback, useEffect } from 'react'

import type { BookmarkType } from './Bookmark'

const createObserver = (root: HTMLElement | null, callback: IntersectionObserverCallback): IntersectionObserver =>
  new IntersectionObserver(callback, {
    root
  })

const observeElements = (
  container: HTMLElement | null,
  observer: IntersectionObserver | undefined,
  elements: (HTMLElement | null)[]
): (() => void) => {
  elements.forEach(element => {
    if (element && container && observer) {
      observer.observe(element)
    }
  })

  return () => {
    elements.forEach(element => {
      if (element && container && observer) {
        observer.unobserve(element)
      }
    })
  }
}

const checkVisibility = (
  entry: IntersectionObserverEntry,
  setState: React.Dispatch<React.SetStateAction<BookmarkType>>
) => {
  const { boundingClientRect, isIntersecting, rootBounds } = entry
  const isVisible = isIntersecting
  let orientation
  console.log('on checke')

  if (!isVisible) {
    if (rootBounds) {
      if (boundingClientRect.bottom < rootBounds.top) {
        orientation = 'top'
      } else if (boundingClientRect.top > rootBounds.bottom) {
        orientation = 'bottom'
      }
    }
  }

  setState(prevState =>
    prevState.orientation !== orientation || prevState.visible !== !isVisible
      ? { orientation, ref: prevState.ref, title: prevState.title, visible: !isVisible }
      : prevState
  )
}

export const useObserver = (
  containerRef: React.RefObject<HTMLElement>,
  observedElement: {
    ref: React.RefObject<HTMLElement>
    setState: React.Dispatch<React.SetStateAction<BookmarkType>>
  }[]
) => {
  const callback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      observedElement.forEach(({ ref, setState }) => {
        const targetEntry = entries.find(entry => entry.target === ref.current)
        if (targetEntry) {
          checkVisibility(targetEntry, setState)
        }
      })
    },
    [observedElement]
  )

  useEffect(() => {
    let observer: IntersectionObserver | undefined
    if (containerRef.current) {
      observer = createObserver(containerRef.current, callback)
    }

    return observeElements(
      containerRef.current,
      observer,
      observedElement.map(element => element.ref.current)
    )
  }, [callback, containerRef, observedElement])
}
