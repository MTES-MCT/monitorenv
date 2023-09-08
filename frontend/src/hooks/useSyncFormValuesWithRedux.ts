import { useFormikContext } from 'formik'
import _ from 'lodash'
import { useEffect, useMemo } from 'react'

import { useAppDispatch } from './useAppDispatch'

import type { ActionCreatorWithPayload } from '@reduxjs/toolkit'

export const useSyncFormValuesWithRedux = (setState: ActionCreatorWithPayload<any, string>, setIsDirty) => {
  const { dirty, values } = useFormikContext()
  const dispatch = useAppDispatch()

  const dispatchFormUpdate = useMemo(() => {
    const throttled = newValues => {
      dispatch(setState(newValues))
      if (newValues && dirty) {
        dispatch(setIsDirty)
      }
    }

    return _.throttle(throttled, 500)
  }, [setState, dispatch, dirty, setIsDirty])

  useEffect(() => {
    dispatchFormUpdate(values)
  }, [values, dispatchFormUpdate])

  useEffect(
    () => () => dispatchFormUpdate(undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
}
