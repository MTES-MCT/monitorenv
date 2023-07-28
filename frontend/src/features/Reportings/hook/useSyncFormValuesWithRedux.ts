import { useFormikContext } from 'formik'
import _ from 'lodash'
import { useEffect, useMemo } from 'react'

import { reportingStateActions } from '../../../domain/shared_slices/ReportingState'
import { useAppDispatch } from '../../../hooks/useAppDispatch'

import type { ActionCreatorWithPayload } from '@reduxjs/toolkit'

export const useSyncFormValuesWithRedux = (setReportingState: ActionCreatorWithPayload<any, string>) => {
  const { dirty, values } = useFormikContext()
  const dispatch = useAppDispatch()

  const dispatchFormUpdate = useMemo(() => {
    const throttled = newValues => {
      dispatch(setReportingState(newValues))
      dispatch(reportingStateActions.setIsDirty(newValues ? dirty : false))
    }

    return _.throttle(throttled, 500)
  }, [dispatch, dirty, setReportingState])

  useEffect(() => {
    dispatchFormUpdate(values)
  }, [values, dispatchFormUpdate])

  useEffect(
    () => () => dispatchFormUpdate(undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
}
