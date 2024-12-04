import { debounce } from 'lodash'
import { useCallback, useEffect, useMemo } from 'react'

import type { BookmarkType } from './Bookmark'

// Fonction pour vérifier la visibilité par rapport au conteneur
const checkVisibility = (
  container: HTMLElement | null,
  element: HTMLElement | null,
  setState: React.Dispatch<React.SetStateAction<BookmarkType>>
) => {
  if (!container || !element) {
    return
  }

  const containerRect = container.getBoundingClientRect()
  const elementRect = element.getBoundingClientRect()

  const isVisible = elementRect.top >= containerRect.top && elementRect.bottom <= containerRect.bottom

  let orientation: 'top' | 'bottom' | undefined

  if (!isVisible) {
    if (elementRect.bottom < containerRect.top) {
      orientation = 'top'
    } else if (elementRect.top > containerRect.bottom) {
      orientation = 'bottom'
    }
  }

  setState(prevState =>
    prevState.orientation !== orientation || prevState.visible !== isVisible
      ? { orientation, ref: prevState.ref, title: prevState.title, visible: !isVisible }
      : prevState
  )
}

export const useObserver = (
  containerRef: React.RefObject<HTMLElement>,
  observedElements: {
    ref: React.RefObject<HTMLElement>
    setState: React.Dispatch<React.SetStateAction<BookmarkType>>
  }[]
) => {
  const debouncedHandleVisibility = useMemo(
    () =>
      debounce(() => {
        if (!containerRef.current) {
          return
        }

        observedElements.forEach(({ ref, setState }) => {
          checkVisibility(containerRef.current, ref.current, setState)
        })
      }, 100),
    [containerRef, observedElements]
  )
  const handleVisibility = useCallback(() => {
    debouncedHandleVisibility()
  }, [debouncedHandleVisibility])

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return undefined
    }

    container.addEventListener('scroll', handleVisibility)
    container.addEventListener('resize', handleVisibility)

    return () => {
      container.removeEventListener('scroll', handleVisibility)
      container.removeEventListener('resize', handleVisibility)
    }
  }, [containerRef, handleVisibility])
}
