import { useFormikContext } from 'formik'
import _ from 'lodash'
import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { setIsFormDirty } from '../domain/shared_slices/MissionsState'

export const useSyncFormValuesWithRedux = setFormValues => {
  const formik = useFormikContext()
  const dispatch = useDispatch()

  const dispatchFormUpdate = useMemo(() => {
    const throttled = values => {
      dispatch(setFormValues(values))
      dispatch(setIsFormDirty(formik.dirty))
    }

    return _.throttle(throttled, 500)
  }, [setFormValues, dispatch, formik.dirty])

  useEffect(() => {
    dispatchFormUpdate(formik.values)

    return () => dispatchFormUpdate(null)
  }, [formik.values, dispatchFormUpdate])
}

export function SyncFormValuesWithRedux({ callback }) {
  useSyncFormValuesWithRedux(callback)

  return null
}
