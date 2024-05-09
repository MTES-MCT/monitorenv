import { describe, expect, it } from '@jest/globals'
import { customDayjs } from '@mtes-mct/monitor-ui'

import { Mission } from './mission.type'
import { getIsMissionEnded, getMissionCompletionStatus, getMissionStatus } from './utils'

const pendingMission = {
  endDateTimeUtc: customDayjs().add(3, 'day').toISOString(),
  id: 1,
  startDateTimeUtc: customDayjs().toISOString()
}

const endedMission = {
  endDateTimeUtc: customDayjs().subtract(4, 'day').toISOString(),
  id: 1,
  startDateTimeUtc: customDayjs().subtract(7, 'day').toISOString()
}

const missionUpcoming = {
  endDateTimeUtc: customDayjs().add(7, 'day').toISOString(),
  envActions: [],
  id: 1,
  startDateTimeUtc: customDayjs().add(4, 'day').toISOString()
}

const missionUpToDate = {
  ...pendingMission,
  envActions: [
    {
      actionType: 'SURVEILLANCE',
      completion: 'COMPLETED'
    }
  ]
}

const missionToComplete = {
  ...pendingMission,
  envActions: [
    {
      actionType: 'SURVEILLANCE',
      completion: 'TO_COMPLETE'
    }
  ]
}

const missionCompleted = {
  ...endedMission,
  envActions: [
    {
      actionType: 'SURVEILLANCE',
      completion: 'COMPLETED'
    }
  ]
}

const missionToCompleteEnded = {
  ...endedMission,
  envActions: [
    {
      actionType: 'SURVEILLANCE',
      completion: 'TO_COMPLETE'
    }
  ]
}

describe('mission utils', () => {
  it('getMissionCompletionStatus Should the mission completion status', async () => {
    const missionCompletionUpToDate = getMissionCompletionStatus(missionUpToDate)
    expect(missionCompletionUpToDate).toBe(Mission.FrontCompletionStatus.UP_TO_DATE)

    const missionCompletionCompleted = getMissionCompletionStatus(missionCompleted)
    expect(missionCompletionCompleted).toBe(Mission.FrontCompletionStatus.COMPLETED)

    const missionCompletionToComplete = getMissionCompletionStatus(missionToComplete)
    expect(missionCompletionToComplete).toBe(Mission.FrontCompletionStatus.TO_COMPLETE)

    const missionCompletionToCompleteEnded = getMissionCompletionStatus(missionToCompleteEnded)
    expect(missionCompletionToCompleteEnded).toBe(Mission.FrontCompletionStatus.TO_COMPLETE_MISSION_ENDED)

    const missionCompletionUpcoming = getMissionCompletionStatus(missionUpcoming)
    expect(missionCompletionUpcoming).toBe(undefined)
  })

  it('getIsMissionEnded Should return true if the mission is ended', async () => {
    const isMissionEnded = getIsMissionEnded(endedMission.endDateTimeUtc)
    expect(isMissionEnded).toBe(true)

    const isMissionNotEnded = getIsMissionEnded(pendingMission.endDateTimeUtc)
    expect(isMissionNotEnded).toBe(false)
  })

  it('getMissionStatus Should return the mission status', async () => {
    const yesterday = customDayjs.utc().subtract(1, 'day').toISOString()
    const tomorrow = customDayjs.utc().add(1, 'day').toISOString()

    const openCases: Array<[string | undefined, string | undefined, string]> = [
      [yesterday, undefined, 'PENDING'],
      [yesterday, yesterday, 'ENDED'],
      [yesterday, tomorrow, 'PENDING'],
      [tomorrow, yesterday, 'UPCOMING'],
      [tomorrow, tomorrow, 'UPCOMING']
    ]

    const errorCases: Array<[string | undefined, string | undefined, string]> = openCases.map(([, endDateTimeUtc]) => [
      undefined,
      endDateTimeUtc,
      'ERROR'
    ])

    it.each([...openCases, ...errorCases])(
      'Given %p, %p and %p as `startDateTimeUtc`, `endDateTimeUtc`. Should return %p',
      (startDateTimeUtc, endDateTimeUtc, expectedResult) => {
        const result = getMissionStatus({ endDateTimeUtc, startDateTimeUtc })

        expect(result).toEqual(expectedResult)
      }
    )
  })
})
