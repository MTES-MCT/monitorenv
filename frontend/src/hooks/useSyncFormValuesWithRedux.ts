import { useFormikContext } from 'formik'
import _ from 'lodash'
import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { setIsFormDirty } from '../domain/shared_slices/MissionsState'

export const useSyncFormValuesWithRedux = (setFormValues: (values) => void) => {
  const { dirty, values } = useFormikContext()
  const dispatch = useDispatch()

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
