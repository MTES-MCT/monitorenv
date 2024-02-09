import { diff } from 'deep-object-diff'
import { useFormikContext } from 'formik'
import { omit } from 'lodash'
import { useEffect } from 'react'

import { MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM } from './constants'
import { useListenMissionEventUpdatesById } from './hooks/useListenMissionEventUpdatesById'

import type { Mission } from '../../../domain/entities/missions'

type FormikSyncMissionFormProps = {
  missionId: string | number | undefined
}
/**
 * Sync
 */
export function FormikSyncMissionFields({ missionId }: FormikSyncMissionFormProps) {
  const { setFieldValue, values } = useFormikContext<Mission>()
  const missionEvent = useListenMissionEventUpdatesById(missionId)

  useEffect(
    () => {
      if (!missionEvent || values.id !== missionEvent.id) {
        return
      }

      const receivedDiff = diff(
        omit(values, MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM),
        omit(missionEvent, MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES_IN_FORM)
      )

      /**
       * We iterate and use `setFieldValue` on each diff key to avoid a global re-render of the <MissionForm/> component
       */
      Object.keys(receivedDiff).forEach(key => {
        // eslint-disable-next-line no-console
        console.log(`SSE: setting form key "${key}" to "${JSON.stringify(missionEvent[key])}"`)
        setFieldValue(key, missionEvent[key])
      })
    },

    // We don't want to trigger infinite re-renders since `setFieldValue` changes after each rendering
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [missionEvent]
  )

  return <></>
}
