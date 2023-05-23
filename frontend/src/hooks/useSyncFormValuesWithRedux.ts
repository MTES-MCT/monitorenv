import { useFormikContext } from 'formik'
import _ from 'lodash'
import { useEffect, useMemo } from 'react'

import { setIsFormDirty } from '../domain/shared_slices/MissionsState'
import { useAppDispatch } from './useAppDispatch'

import type { ActionCreatorWithPayload } from '@reduxjs/toolkit'

export const useSyncFormValuesWithRedux = (setFormValues: ActionCreatorWithPayload<any, string>) => {
  const { dirty, values } = useFormikContext()
  const dispatch = useAppDispatch()

  const dispatchFormUpdate = useMemo(() => {
    const throttled = newValues => {
      dispatch(setFormValues(newValues))
      dispatch(setIsFormDirty(dirty))
    }

    return _.throttle(throttled, 500)
  }, [setFormValues, dispatch, dirty])

  useEffect(() => {
    dispatchFormUpdate(values)

    return () => dispatchFormUpdate(null)
  }, [values, dispatchFormUpdate])
}
