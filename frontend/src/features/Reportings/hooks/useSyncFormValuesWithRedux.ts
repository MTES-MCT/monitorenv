import { useFormikContext } from 'formik'
import _ from 'lodash'
import { useEffect, useMemo } from 'react'

import { reportingActions } from '../../../domain/shared_slices/reporting'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'

import type { Reporting } from '../../../domain/entities/reporting'

export const useSyncFormValuesWithRedux = () => {
  const { dirty, values } = useFormikContext<Reporting>()
  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)

  const dispatch = useAppDispatch()

  const dispatchFormUpdate = useMemo(() => {
    const throttled = newValues => {
      if (!newValues || newValues.id !== activeReportingId) {
        return
      }
      dispatch(reportingActions.setReportingState(newValues))
      dispatch(reportingActions.setIsDirty(newValues ? dirty : false))
    }

    return _.throttle(throttled, 500)
  }, [dispatch, dirty, activeReportingId])

  useEffect(() => {
    dispatchFormUpdate(values)
  }, [values, dispatchFormUpdate])

  useEffect(
    () => () => dispatchFormUpdate(undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
}
