import { useDeepCompareEffect } from '@mtes-mct/monitor-ui'
import { diff } from 'deep-object-diff'
import { useFormikContext } from 'formik'
import { omit } from 'lodash'
import { useEffect, useState } from 'react'

import { getMissionUpdatesEventSource, MISSION_UPDATE_EVENT, missionEventListener } from './sse'

import type { Mission } from '../../../domain/entities/missions'

/**
 * These properties does not require to be sync - so we do not update them.
 * @see https://github.com/MTES-MCT/monitorenv/blob/main/backend/src/main/kotlin/fr/gouv/cacem/monitorenv/infrastructure/api/adapters/publicapi/outputs/MissionDataOutput.kt#L11
 */
const UNSYNCHRONIZED_PROPERTIES = [
  'attachedReportingIds',
  'attachedReportings',
  'detachedReportingIds',
  'detachedReportings',
  'isGeometryComputedFromControls',
  // We do not update this field as it is not used by the form
  'updatedAtUtc',
  // We do not update this field as it is not used by the form
  'createdAtUtc',
  // TODO add the update of the env actions
  'envActions'
]

type FormikSyncMissionFormProps = {
  missionId: number | undefined
}
/**
 * Sync
 */
export function FormikSyncMissionFields({ missionId }: FormikSyncMissionFormProps) {
  const { setFieldValue, values } = useFormikContext<Mission>()
  const [receivedMission, setReceivedMission] = useState<Mission | undefined>()

  useEffect(() => {
    if (!missionId) {
      return undefined
    }

    const listener = missionEventListener(missionId, mission => setReceivedMission(mission))

    getMissionUpdatesEventSource().addEventListener(MISSION_UPDATE_EVENT, listener)

    return () => {
      getMissionUpdatesEventSource().removeEventListener(MISSION_UPDATE_EVENT, listener)
    }
  }, [missionId, receivedMission])

  useDeepCompareEffect(
    () => {
      if (!receivedMission) {
        return
      }

      ;(async () => {
        const receivedDiff = diff(
          omit(values, UNSYNCHRONIZED_PROPERTIES),
          omit(receivedMission, UNSYNCHRONIZED_PROPERTIES)
        )

        /**
         * We iterate and use `setFieldValue` on each diff key to avoid a global re-render of the <MissionForm/> component
         */
        Object.keys(receivedDiff).forEach(key => {
          // eslint-disable-next-line no-console
          console.log(`SSE: setting form key "${key}" to "${JSON.stringify(receivedMission[key])}"`)
          setFieldValue(key, receivedMission[key])
        })
      })()
    },

    // We don't want to trigger infinite re-renders since `setFieldValue` changes after each rendering
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [receivedMission]
  )

  return <></>
}
