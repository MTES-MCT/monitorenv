import { useEffect } from 'react'

type UseEscapeKeyProps = {
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onEnter?: () => void
  onEscape?: () => void
  ref?: React.RefObject<HTMLElement>
}
export const useEscapeKey = ({ onArrowLeft, onArrowRight, onEnter, onEscape, ref }: UseEscapeKeyProps) => {
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

    if (ref) {
      ref.current?.addEventListener('keydown', handleKeyDown, false)
    } else {
      document.addEventListener('keydown', handleKeyDown, false)
    }

    return () => {
      if (ref) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ref.current?.removeEventListener('keydown', handleKeyDown, false)
      } else {
        document.removeEventListener('keydown', handleKeyDown, false)
      }
    }
  }, [onEscape, onArrowLeft, onArrowRight, onEnter, ref])
}
