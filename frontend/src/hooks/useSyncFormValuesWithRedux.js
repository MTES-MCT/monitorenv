import { useFormikContext } from 'formik'
import _ from 'lodash'
import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'

export const useSyncFormValuesWithRedux = setFormValues => {
  const formik = useFormikContext()
  const dispatch = useDispatch()

  const dispatchFormUpdate = useMemo(() => {
    const throttled = values => dispatch(setFormValues(values))

    return _.throttle(throttled, 500)
  }, [setFormValues, dispatch])

  useEffect(() => {
    dispatchFormUpdate(formik.values)

    return () => dispatchFormUpdate(null)
  }, [formik.values, dispatchFormUpdate])
}

export function SyncFormValuesWithRedux({ callback }) {
  useSyncFormValuesWithRedux(callback)

  return null
}
