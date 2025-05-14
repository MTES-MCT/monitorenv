import { debounce } from 'lodash-es'
import { useEffect, useMemo } from 'react'

import type { BookmarkType } from '../components/DashboardForm/Bookmark'

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

export const useObserverAccordion = (
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
      }, 200),
    [containerRef, observedElements]
  )

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return undefined
    }

    observedElements
      // find the wrapper of the selected item and attached callback when transition ends (open / close accordion)
      .map(observedElement => observedElement.ref.current?.nextElementSibling?.nextElementSibling)
      .forEach(selectedItems => {
        selectedItems?.addEventListener('transitionend', debouncedHandleVisibility)
      })

    container.addEventListener('scroll', debouncedHandleVisibility)
    container.addEventListener('resize', debouncedHandleVisibility)

    return () => {
      container.removeEventListener('scroll', debouncedHandleVisibility)
      container.removeEventListener('resize', debouncedHandleVisibility)
      observedElements
        .map(observedElement => observedElement.ref.current?.nextElementSibling?.nextElementSibling)
        .forEach(selectedItems => {
          selectedItems?.removeEventListener('transitionend', debouncedHandleVisibility)
        })
    }
  }, [containerRef, debouncedHandleVisibility, observedElements])
}
