import { useFormikContext } from 'formik'
import _ from 'lodash'
import { useEffect, useMemo } from 'react'

import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { missionFormsActions } from '../slice'

import type { Mission } from '../../../../domain/entities/missions'

export const useSyncFormValuesWithRedux = () => {
  const { dirty, values } = useFormikContext<Mission>()
  const activeMissionId = useAppSelector(state => state.missionForms.activeMissionId)

  const dispatch = useAppDispatch()
  const dispatchFormUpdate = useMemo(() => {
    const throttled = newValues => {
      if (!newValues || newValues.id !== activeMissionId) {
        return
      }
      dispatch(missionFormsActions.setMission({ isFormDirty: newValues ? dirty : false, missionForm: newValues }))
    }

    return _.throttle(throttled, 500)
  }, [activeMissionId, dispatch, dirty])

  useEffect(() => {
    dispatchFormUpdate(values)
  }, [values, dispatchFormUpdate])

  useEffect(
    () => () => dispatchFormUpdate(undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
}
