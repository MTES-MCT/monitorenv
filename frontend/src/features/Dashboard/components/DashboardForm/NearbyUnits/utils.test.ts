import { describe, expect, it } from '@jest/globals'

import { getDateRangeFormatted } from './utils'

import type { Mission } from '../../../../../domain/entities/missions'

describe('getDateRangeFormatted', () => {
  it('should return correct start and end dates for one mission', () => {
    const missions = [
      {
        endDateTimeUtc: '2023-01-05',
        startDateTimeUtc: '2023-01-01'
      }
    ] as Mission[]
    expect(getDateRangeFormatted(missions)).toEqual({ end: '05/01/2023', isSingleDayRange: false, start: '01/01/2023' })
  })

  it('should return global start and end for multiple missions', () => {
    const missions = [
      {
        endDateTimeUtc: '2023-02-05',
        startDateTimeUtc: '2023-02-01'
      },
      {
        endDateTimeUtc: '2023-01-15',
        startDateTimeUtc: '2023-01-01'
      }
    ] as Mission[]
    expect(getDateRangeFormatted(missions)).toEqual({ end: '05/02/2023', isSingleDayRange: false, start: '01/01/2023' })
  })

  it('should return undefined when there is no endDateTimeUtc', () => {
    const missions = [
      {
        startDateTimeUtc: '2023-01-01'
        // no end date
      }
    ] as Mission[]
    expect(getDateRangeFormatted(missions)).toEqual({ end: undefined, isSingleDayRange: false, start: '01/01/2023' })
  })

  it('should return single day range when start and end are the same', () => {
    const missions = [
      {
        endDateTimeUtc: '2023-02-01',
        startDateTimeUtc: '2023-02-01'
      }
    ] as Mission[]
    expect(getDateRangeFormatted(missions)).toEqual({ end: '01/02/2023', isSingleDayRange: true, start: '01/02/2023' })
  })

  it('should return undefined when there is no date', () => {
    const missions = [] as Mission[]
    expect(getDateRangeFormatted(missions)).toBeUndefined()
  })
})
