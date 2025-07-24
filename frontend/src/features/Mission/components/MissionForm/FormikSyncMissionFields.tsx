import { useAppDispatch } from '@hooks/useAppDispatch'
import { undefine } from '@mtes-mct/monitor-ui'
import { useMissionEventContext } from 'context/mission/useMissionEventContext'
import { diff } from 'deep-object-diff'
import { useFormikContext } from 'formik'
import { omit } from 'lodash-es'
import { useEffect } from 'react'

import { attachReportingToMissionSliceActions } from './AttachReporting/slice'
import {
  FULL_MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM,
  MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM
} from './constants'
import { FULL_MISSION_UPDATE_EVENT } from './hooks/useListenMissionEventUpdates'

import type { Mission } from '../../../../domain/entities/missions'

type FormikSyncMissionFormProps = {
  missionId: string | number | undefined
}
/**
 * Sync
 */
export function FormikSyncMissionFields({ missionId }: FormikSyncMissionFormProps) {
  const dispatch = useAppDispatch()

  const { setFieldValue, values } = useFormikContext<Mission>()
  const { event, getMissionEventById, setMissionEventInContext } = useMissionEventContext()
  const missionEvent = getMissionEventById(missionId)

  useEffect(
    () => {
      if (!missionEvent || values.id !== missionEvent.id) {
        return
      }

      let receivedDiff
      if (event === FULL_MISSION_UPDATE_EVENT) {
        receivedDiff = diff(
          omit(values, FULL_MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM),
          omit(missionEvent, FULL_MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM)
        )
      } else {
        receivedDiff = diff(
          omit(values, MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM),
          omit(missionEvent, MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM)
        )
      }

      /**
       * We iterate and use `setFieldValue` on each diff key to avoid a global re-render of the <MissionForm/> component
       */
      Object.keys(receivedDiff).forEach(key => {
        if (values[key] === undefined && JSON.stringify(missionEvent[key]) === 'null') {
          return
        }

        if (key === 'attachedReportings') {
          dispatch(attachReportingToMissionSliceActions.setAttachedReportings(missionEvent.attachedReportings))
          if (missionEvent.attachedReportings === undefined) {
            return
          }
        }
        // eslint-disable-next-line no-console
        console.log(`SSE: setting form key "${key}" to "${JSON.stringify(missionEvent[key])}"`)
        setFieldValue(key, undefine(missionEvent[key]))
      })

      // we need to wait for the form to be updated before removing the mission event from the context
      setTimeout(() => {
        setMissionEventInContext(undefined)
      }, 500)
    },

    // We don't want to trigger infinite re-renders since `setFieldValue` changes after each rendering
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [missionEvent]
  )

  return <></>
}
