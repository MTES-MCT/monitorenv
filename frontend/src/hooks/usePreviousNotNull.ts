import { type MutableRefObject, useEffect, useRef } from 'react'

export const usePreviousNotNull = <T extends unknown>(value: T) => {
  const ref = useRef() as MutableRefObject<T>

  useEffect(() => {
    if (!value) {
      return
    }

    ref.current = value
  }, [value])

  return ref.current
}
