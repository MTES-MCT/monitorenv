import { useAppDispatch } from '@hooks/useAppDispatch'
import { undefine } from '@mtes-mct/monitor-ui'
import { useReportingEventContext } from 'context/reporting/useReportingEventContext'
import { diff } from 'deep-object-diff'
import { useFormikContext } from 'formik'
import { omit } from 'lodash-es'
import { useEffect } from 'react'

import { attachMissionToReportingSliceActions } from './AttachMission/slice'
import { REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM } from './constants'

import type { Reporting } from 'domain/entities/reporting'

type FormikSyncReportingFormProps = {
  reportingId: string | number | undefined
}
/**
 * Sync
 */
export function FormikSyncReportingFields({ reportingId }: FormikSyncReportingFormProps) {
  const dispatch = useAppDispatch()
  const { setFieldValue, values } = useFormikContext<Reporting>()
  const { getReportingEventById, setReportingEventInContext } = useReportingEventContext()
  const reportingEvent = getReportingEventById(reportingId)

  useEffect(
    () => {
      if (!reportingEvent || values.id !== reportingEvent.id) {
        return
      }

      const receivedDiff = diff(
        omit(values, REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM),
        omit(reportingEvent, REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM)
      )

      /**
       * We iterate and use `setFieldValue` on each diff key to avoid a global re-render of the <ReportingForm/> component
       */
      Object.keys(receivedDiff).forEach(key => {
        if (values[key] === undefined && JSON.stringify(reportingEvent[key]) === 'null') {
          return
        }
        // eslint-disable-next-line no-console
        console.log(`SSE: setting form key "${key}" to "${JSON.stringify(reportingEvent[key])}"`)

        setFieldValue(key, undefine(reportingEvent[key]))
        if (key === 'attachedMission') {
          dispatch(attachMissionToReportingSliceActions.setAttachedMission(reportingEvent.attachedMission))
        }
      })

      // we need to wait for the form to be updated before removing the reporting event from the context
      setTimeout(() => {
        setReportingEventInContext(undefined)
      }, 500)
    },

    // We don't want to trigger infinite re-renders since `setFieldValue` changes after each rendering
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reportingEvent]
  )

  return <></>
}
