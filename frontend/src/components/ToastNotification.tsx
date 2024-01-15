import { useEffect } from 'react'
import { toast as toastifyToast } from 'react-toastify'

import { ErrorType } from '../domain/entities/errors'
import { useAppSelector } from '../hooks/useAppSelector'

import type { ToastOptions } from 'react-toastify'

const DEFAULT_TOAST_TYPE = 'error'

const DEFAULT_TOAST_OPTIONS: ToastOptions = {
  autoClose: 3000,
  containerId: 'map',
  position: 'bottom-right'
}

// todo use monitor-ui component
export function ToastNotification() {
  const toast = useAppSelector(state => state.global.toast)

  useEffect(() => {
    if (toast) {
      const TOAST_OPTIONS = toast.containerId
        ? { ...DEFAULT_TOAST_OPTIONS, containerId: toast.containerId }
        : DEFAULT_TOAST_OPTIONS

      if (toast.type && toast.type === ErrorType.INFO_AND_HIDDEN) {
        return
      }
      const toastMessage = toast.message

      if (toastMessage instanceof Error) {
        toastifyToast.error(toastMessage.message, TOAST_OPTIONS)

        return
      }

      const type = toast.type || DEFAULT_TOAST_TYPE

      switch (type) {
        case ErrorType.INFO:
          toastifyToast.info(toastMessage, TOAST_OPTIONS)
          break
        case ErrorType.SUCCESS:
          toastifyToast.success(toastMessage, TOAST_OPTIONS)
          break
        case ErrorType.WARNING:
          toastifyToast.warn(toastMessage, TOAST_OPTIONS)
          break
        case ErrorType.ERROR:
        default:
          toastifyToast.error(toastMessage, TOAST_OPTIONS)
          break
      }
    }
  }, [toast])

  return null
}
