import { type FormikErrors, useFormikContext } from 'formik'
import { isEmpty } from 'lodash'
import { useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { missionFormsActions } from '../slice'

import type { Mission } from '../../../../domain/entities/missions'

export function useSyncFormValuesWithRedux(isAutoSaveEnabled: boolean) {
  const dispatch = useAppDispatch()
  const { dirty, validateForm, values } = useFormikContext<Mission>()
  const activeMissionId = useAppSelector(state => state.missionForms.activeMissionId)
  const selectedMissions = useAppSelector(state => state.missionForms.missions)
  const engagedControlUnit = useAppSelector(state =>
    activeMissionId ? state.missionForms.missions[activeMissionId]?.engagedControlUnit : undefined
  )

  const dispatchFormUpdate = useDebouncedCallback(async (newValues: Mission) => {
    if (!newValues || newValues.id !== activeMissionId) {
      return
    }

    const errors = await validateForm()
    const isFormDirty = isMissionFormDirty(errors)

    dispatch(missionFormsActions.setMission({ engagedControlUnit, isFormDirty, missionForm: newValues }))
  }, 500)

  /**
   * The form is dirty if:
   * - In auto-save mode, an error is found (hence the form is not saved)
   * - In manual save mode, values have been modified (using the `dirty` props of Formik)
   */
  function isMissionFormDirty(errors: FormikErrors<Mission>) {
    if (!isAutoSaveEnabled) {
      if (dirty) {
        return dirty
      }

      /**
       * If the form was already dirty and still open, the new `dirty` property is not valid anymore as Formik
       * has been re-instantiated with the saved values.
       * We use the last `isFormDirty` value instead of `dirty`.
       */
      return (activeMissionId && selectedMissions[activeMissionId]?.isFormDirty) || false
    }

    return !isEmpty(errors)
  }

  useEffect(() => {
    dispatchFormUpdate(values)
  }, [values, dispatchFormUpdate])
}
