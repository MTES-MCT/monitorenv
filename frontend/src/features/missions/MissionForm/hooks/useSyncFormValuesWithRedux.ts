import { useFormikContext } from 'formik'
import _ from 'lodash'
import { useEffect, useMemo } from 'react'

import { setIsFormDirty, setMissionState } from '../../../../domain/shared_slices/MissionsState'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { attachReportingToMissionSliceActions } from '../AttachReporting/slice'

import type { Mission } from '../../../../domain/entities/missions'

export const useSyncFormValuesWithRedux = () => {
  const { dirty, values } = useFormikContext<Mission>()

  const dispatch = useAppDispatch()
  const dispatchFormUpdate = useMemo(() => {
    const throttled = newValues => {
      dispatch(setMissionState(newValues))
      dispatch(setIsFormDirty(newValues ? dirty : false))
      if (values?.attachedReportingIds?.length !== values?.attachedReportings?.length) {
        dispatch(attachReportingToMissionSliceActions.setAttachedReportingIds(newValues?.attachedReportingIds))
        dispatch(attachReportingToMissionSliceActions.setAttachedReportings(newValues?.attachedReportings))
      }
    }

    return _.throttle(throttled, 500)
  }, [dispatch, dirty, values])

  useEffect(() => {
    dispatchFormUpdate(values)
  }, [values, dispatchFormUpdate])

  useEffect(
    () => () => dispatchFormUpdate(undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
}
