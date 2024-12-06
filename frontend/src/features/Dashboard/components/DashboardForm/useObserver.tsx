import { useEffect } from 'react'

import type { BookmarkType } from './Bookmark'

const createObserver = (root: HTMLElement | null, callback: IntersectionObserverCallback): IntersectionObserver =>
  new IntersectionObserver(callback, {
    root,
    threshold: 1
  })

const observeElements = (observer: IntersectionObserver, elements: (HTMLElement | null)[]): (() => void) => {
  elements.forEach(element => {
    if (element) {
      observer.observe(element)
    }
  })

  return () => {
    elements.forEach(element => {
      if (element) {
        observer.unobserve(element)
      }
    })
  }
}

const checkVisibility = (
  entries: IntersectionObserverEntry[],
  state: BookmarkType,
  setState: React.Dispatch<React.SetStateAction<BookmarkType>>
) => {
  entries.forEach(entry => {
    const { boundingClientRect, isIntersecting, rootBounds } = entry
    const isVisible = isIntersecting
    let { orientation } = state

    if (!isVisible) {
      if (rootBounds) {
        if (boundingClientRect.bottom < rootBounds.top) {
          orientation = 'top'
        } else if (boundingClientRect.top > rootBounds.bottom) {
          orientation = 'bottom'
        }
      }
    }
    setState({ ...state, orientation, visible: !isVisible })
  })
}

export const useObserver = (
  containerRef: React.RefObject<HTMLElement>,
  observedElement: {
    ref: React.RefObject<HTMLElement>
    setState: React.Dispatch<React.SetStateAction<BookmarkType>>
    state: BookmarkType
  }[]
) => {
  useEffect(() => {
    const observer = createObserver(containerRef.current, entries => {
      observedElement.forEach(({ ref, setState, state }) => {
        const targetEntry = entries.find(entry => entry.target === ref.current)
        if (targetEntry) {
          checkVisibility([targetEntry], state, setState)
        }
      })
    })

    const cleanup = observeElements(
      observer,
      observedElement.map(config => config.ref.current)
    )

    return cleanup
  }, [containerRef, observedElement])
}
