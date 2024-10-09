import { useEffect } from 'react'

type UseEscapeKeyProps = {
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onEnter?: () => void
  onEscape?: () => void
}
export const useEscapeKey = ({ onArrowLeft, onArrowRight, onEnter, onEscape }: UseEscapeKeyProps) => {
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Enter' && onEnter) {
        onEnter()
      }

      if (event.key === 'Escape' && onEscape) {
        onEscape()
      }

      if (event.key === 'ArrowLeft' && onArrowLeft) {
        onArrowLeft()
      }

      if (event.key === 'ArrowRight' && onArrowRight) {
        onArrowRight()
      }
    }

    document.addEventListener('keydown', handleKeyDown, false)

    return () => {
      document.removeEventListener('keydown', handleKeyDown, false)
    }
  }, [onEscape, onArrowLeft, onArrowRight, onEnter])
}
