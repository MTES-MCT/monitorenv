import { useFormikContext } from 'formik'
import _ from 'lodash'
import { useEffect, useMemo } from 'react'

import { useAppDispatch } from './useAppDispatch'
import { setIsFormDirty } from '../domain/shared_slices/MissionsState'

import type { ActionCreatorWithPayload } from '@reduxjs/toolkit'

export const useSyncFormValuesWithRedux = (setMissionState: ActionCreatorWithPayload<any, string>) => {
  const { dirty, values } = useFormikContext()
  const dispatch = useAppDispatch()

  const dispatchFormUpdate = useMemo(() => {
    const throttled = newValues => {
      dispatch(setMissionState(newValues))
      dispatch(setIsFormDirty(dirty))
    }

    return _.throttle(throttled, 500)
  }, [setMissionState, dispatch, dirty])

  useEffect(() => {
    dispatchFormUpdate(values)
  }, [values, dispatchFormUpdate])

  useEffect(
    () => () => dispatchFormUpdate(undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
}
