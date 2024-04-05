import { describe, expect, it } from '@jest/globals'
import { customDayjs } from '@mtes-mct/monitor-ui'

import { getMissionStatus } from '../missions'

describe('getMissionStatus()', () => {
  const yesterday = customDayjs.utc().subtract(1, 'day').toISOString()
  const tomorrow = customDayjs.utc().add(1, 'day').toISOString()

  const openCases: Array<[string | undefined, string | undefined, boolean | undefined, string]> = [
    [yesterday, undefined, false, 'PENDING'],
    [yesterday, yesterday, false, 'ENDED'],
    [yesterday, tomorrow, false, 'PENDING'],
    [tomorrow, yesterday, false, 'UPCOMING'],
    [tomorrow, tomorrow, false, 'UPCOMING']
  ]

  const errorCases: Array<[string | undefined, string | undefined, boolean | undefined, string]> = openCases.map(
    ([, endDateTimeUtc]) => [undefined, endDateTimeUtc, true, 'ERROR']
  )

  it.each([...openCases, ...errorCases])(
    'Given %p, %p and %p as `startDateTimeUtc`, `endDateTimeUtc`. Should return %p',
    (startDateTimeUtc, endDateTimeUtc, expectedResult) => {
      const result = getMissionStatus({ endDateTimeUtc, startDateTimeUtc })

      expect(result).toEqual(expectedResult)
    }
  )
})
