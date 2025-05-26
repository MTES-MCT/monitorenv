import { customDayjs } from '@mtes-mct/monitor-ui'

import type { Dayjs } from 'dayjs'
import type { Mission } from 'domain/entities/missions'

export function getDateRange(missions: Mission[]) {
  if (missions.length === 0) {
    return undefined
  }

  const { end, start } = missions.reduce(
    (missionDateRange: { end: Dayjs | undefined; start: Dayjs | undefined }, mission) => {
      if (mission.envActions.length === 0) {
        return missionDateRange
      }
      const { endAction, startAction } = mission.envActions.reduce(
        (actionDateRange, envAction) => {
          const startDateTimeUtc = envAction.actionStartDateTimeUtc
            ? customDayjs(envAction.actionStartDateTimeUtc)
            : undefined
          const endDateTimeUtc =
            'actionEndDateTimeUtc' in envAction && envAction.actionEndDateTimeUtc
              ? customDayjs(envAction.actionEndDateTimeUtc)
              : undefined

          return {
            endAction: endDateTimeUtc?.isAfter(actionDateRange.endAction) ? endDateTimeUtc : actionDateRange.endAction,
            startAction: startDateTimeUtc?.isBefore(actionDateRange.startAction)
              ? startDateTimeUtc
              : actionDateRange.startAction
          }
        },
        {
          endAction:
            mission.envActions[0] &&
            'actionEndDateTimeUtc' in mission.envActions[0] &&
            mission.envActions[0]?.actionEndDateTimeUtc
              ? customDayjs(mission.envActions[0]?.actionEndDateTimeUtc)
              : undefined,
          startAction: mission.envActions[0]?.actionStartDateTimeUtc
            ? customDayjs(mission.envActions[0]?.actionStartDateTimeUtc)
            : undefined
        }
      )

      return {
        end: !missionDateRange.end || endAction?.isAfter(missionDateRange.end) ? endAction : missionDateRange.end,
        start:
          !missionDateRange.start || startAction?.isBefore(missionDateRange.start)
            ? startAction
            : missionDateRange.start
      }
    },
    {
      end: undefined,
      start: undefined
    }
  )

  return { end: end?.format('DD/MM/YYYY'), start: start?.format('DD/MM/YYYY') }
}
