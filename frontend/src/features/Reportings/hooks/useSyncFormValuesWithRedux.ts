import { reportingActions } from '@features/Reportings/slice'
import { useFormikContext, type FormikErrors } from 'formik'
import { isEmpty } from 'lodash-es'
import { useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'

import type { Reporting } from '../../../domain/entities/reporting'
import type { AtLeast } from 'types'

export const useSyncFormValuesWithRedux = (isAutoSaveEnabled: boolean) => {
  const { dirty, validateForm, values } = useFormikContext<Reporting>()
  const activeReportingId = useAppSelector(state => state.reporting.activeReportingId)
  const activeReporting =
    useAppSelector(state => (activeReportingId ? state.reporting.reportings[activeReportingId] : undefined)) ??
    undefined

  const dispatch = useAppDispatch()

  const dispatchFormUpdate = useDebouncedCallback(
    async (newValues: AtLeast<Reporting, 'id'>) => {
      if (!newValues || newValues.id !== activeReportingId) {
        return
      }

      const errors = await validateForm()
      const isFormDirtyOrErrored = isReportingFormDirtyOrErrored(errors)

      dispatch(reportingActions.setReportingState(newValues))
      dispatch(reportingActions.setIsDirty(isFormDirtyOrErrored))
    },

    250
  )

  /** The form is dirty if:
   * - In auto-save mode, an error is found (hence the form is not saved)
   * - In manual save mode, values have been modified (using the `dirty` props of Formik)
   */
  function isReportingFormDirtyOrErrored(errors: FormikErrors<Reporting>) {
    if (!isAutoSaveEnabled) {
      if (dirty) {
        return dirty
      }

      /**
       * If the form was already dirty and still open, the new `dirty` property is not valid anymore as Formik
       * has been re-instantiated with the saved values.
       * We use the last `isFormDirty` value instead of `dirty`.
       */
      return activeReporting?.isFormDirty ?? false
    }

    return !isEmpty(errors)
  }

  useEffect(() => {
    dispatchFormUpdate(values)
  }, [values, dispatchFormUpdate])
}
