import { useCallback, useEffect, useState } from 'react'

export const useEscapeFromKeyboard = () => {
  const [escape, setEscape] = useState(null)

  const escapeFromKeyboard = useCallback((event: KeyboardEvent) => {
    const escapeKeyCode = 27
    // TODO Deprecated: use `event.key` instead.
    if (event.keyCode === escapeKeyCode) {
      // @ts-ignore
      setEscape({ dummyTrigger: true })
    }

    document.removeEventListener('keydown', escapeFromKeyboard, false)
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', escapeFromKeyboard, false)
  }, [escapeFromKeyboard])

  return escape
}
