import { useEffect } from 'react'

export const useEscapeKey = (onEscape?: () => void) => {
  useEffect(() => {
    const escapeFromKeyboard = event => {
      if (event.key === 'Escape' && onEscape) {
        onEscape()
      }
    }

    document.addEventListener('keydown', escapeFromKeyboard, false)

    return () => {
      document.removeEventListener('keydown', escapeFromKeyboard, false)
    }
  }, [onEscape])
}
