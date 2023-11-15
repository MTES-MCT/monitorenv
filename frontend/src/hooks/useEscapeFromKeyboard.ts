import { useCallback, useEffect, useState } from 'react'

export const useEscapeFromKeyboard = () => {
  const [escape, setEscape] = useState<{ dummyTrigger: true } | null>(null)

  const escapeFromKeyboard = useCallback((event: KeyboardEvent) => {
    const escapeKeyCode = 27
    if (event.keyCode === escapeKeyCode) {
      setEscape({ dummyTrigger: true })
    }

    document.removeEventListener('keydown', escapeFromKeyboard, false)
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', escapeFromKeyboard, false)
  }, [escapeFromKeyboard])

  return escape
}
