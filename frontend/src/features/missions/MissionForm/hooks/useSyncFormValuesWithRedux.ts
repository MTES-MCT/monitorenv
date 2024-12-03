import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useFormikContext } from 'formik'
import { useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { getActiveMission, missionFormsActions } from '../slice'
import { getIsMissionFormValid } from '../utils'

import type { Mission } from 'domain/entities/missions'

export function useSyncFormValuesWithRedux(isAutoSaveEnabled: boolean) {
  const dispatch = useAppDispatch()
  const { dirty, values } = useFormikContext<Mission>()
  const activeMissionId = useAppSelector(state => state.missionForms.activeMissionId)
  const activeMission = useAppSelector(state => getActiveMission(state.missionForms))
  const engagedControlUnit = activeMission?.engagedControlUnit

  const dispatchFormUpdate = useDebouncedCallback(async (newValues: Mission) => {
    if (!newValues || newValues.id !== activeMissionId) {
      return
    }

    const isFormDirty = isMissionFormDirty()

    dispatch(
      missionFormsActions.setMission({
        engagedControlUnit,
        isFormDirty,
        missionForm: newValues
      })
    )
  }, 350)

  /**
   * The form is dirty if:
   * - In auto-save mode, an error is found (hence the form is not saved)
   * - In manual save mode, values have been modified (using the `dirty` props of Formik)
   */
  function isMissionFormDirty() {
    if (!isAutoSaveEnabled) {
      if (dirty) {
        return dirty
      }

      /**
       * If the form was already dirty and still open, the new `dirty` property is not valid anymore as Formik
       * has been re-instantiated with the saved values.
       * We use the last `isFormDirty` value instead of `dirty`.
       */
      return activeMission?.isFormDirty ?? false
    }

    const isMissionFormValid = getIsMissionFormValid(values)

    return !isMissionFormValid
  }

  useEffect(() => {
    dispatchFormUpdate(values)
  }, [values, dispatchFormUpdate])
}
