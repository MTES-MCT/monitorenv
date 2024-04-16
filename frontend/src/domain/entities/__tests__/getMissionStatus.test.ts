import { describe, expect, it } from '@jest/globals'
import { customDayjs } from '@mtes-mct/monitor-ui'

import { getMissionStatus } from '../missions'

describe('getMissionStatus()', () => {
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
