
import { useEffect, useMemo } from "react"
import { useFormikContext } from 'formik'
import { useDispatch } from "react-redux"
import _ from 'lodash'

export const useSyncFormValuesWithRedux = (setFormValues) =>{
  const formik = useFormikContext()
  const dispatch = useDispatch()
  
  const dispatchFormUpdate = useMemo(() => {
    const throttled = (values) => dispatch(setFormValues(values))
    return _.throttle(throttled, 500)  
  }, [setFormValues, dispatch])
  
  useEffect(() => {
    dispatchFormUpdate(formik.values)
    return () => dispatchFormUpdate(null)
  }, [formik.values, dispatchFormUpdate])
}


export const SyncFormValuesWithRedux = ({callback}) => {
  useSyncFormValuesWithRedux(callback)
  return null
}