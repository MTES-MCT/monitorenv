import { useEffect, useState } from 'react'

export const useClickOutsideWhenOpened = (ref, isOpened) => {
  const [clicked, setClicked] = useState<{}>()

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setClicked({})
      } else {
        setClicked(undefined)
      }
    }

    // Bind the event listener
    if (isOpened) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, isOpened])

  return clicked
}
