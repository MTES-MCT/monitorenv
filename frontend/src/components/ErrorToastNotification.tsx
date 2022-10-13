import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'

import { ErrorType } from '../domain/entities/errors'

import type { ToastOptions } from 'react-toastify'

const TOAST_OPTIONS: ToastOptions = {
  autoClose: 3000,
  position: 'bottom-right'
}

export function ErrorToastNotification() {
  // TODO Remove `any` once Redux Global state typed.
  const { error } = useSelector(state => (state as any).global)

  useEffect(() => {
    if (error) {
      if (error.type && error.type === ErrorType.INFO_AND_HIDDEN) {
        return
      }

      if (error instanceof Error) {
        toast.error(error.message, TOAST_OPTIONS)

        return
      }

      const toastMessage = error.message.split(':')[0]

      switch (error.type) {
        case ErrorType.INFO:
          toast.info(toastMessage, TOAST_OPTIONS)
          break

        case ErrorType.WARNING:
        default:
          toast.warn(toastMessage, TOAST_OPTIONS)
          break
      }
    }
  }, [error])

  return <ToastContainer />
}
