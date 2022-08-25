import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useToasts } from 'react-toast-notifications'

import { errorType } from '../domain/entities/errors'

const ErrorToastNotification = () => {
  const { error } = useSelector(state => state.global)
  const { addToast } = useToasts()

  useEffect(() => {
    if (error) {
      if (error.type && error.type === errorType.INFO_AND_HIDDEN) {
        return
      }

      if (error.type) {
        addToast(error.message.split(':')[0], {
          appearance: error.type,
          autoDismiss: true,
          autoDismissTimeout: 10000
        })
      } else {
        addToast(error.message.split(':')[0], {
          appearance: 'warning',
          autoDismiss: true,
          autoDismissTimeout: 10000
        })
      }
    }
  }, [error, addToast])

  return null
}

export default ErrorToastNotification
