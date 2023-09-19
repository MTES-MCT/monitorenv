import { useFormikContext } from 'formik'
import _ from 'lodash'
import { useEffect, useMemo } from 'react'

import { reportingActions } from '../../../domain/shared_slices/reporting'
import { useAppDispatch } from '../../../hooks/useAppDispatch'

export const useSyncFormValuesWithRedux = () => {
  const { dirty, values } = useFormikContext()

  const dispatch = useAppDispatch()
  const dispatchFormUpdate = useMemo(() => {
    const throttled = newValues => {
      if (!newValues) {
        return
      }
      dispatch(reportingActions.setReportingState(newValues))
      dispatch(reportingActions.setIsDirty(newValues ? dirty : false))
    }

    return _.throttle(throttled, 500)
  }, [dispatch, dirty])

  useEffect(() => {
    dispatchFormUpdate(values)
  }, [values, dispatchFormUpdate])

  useEffect(
    () => () => dispatchFormUpdate(undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
}
