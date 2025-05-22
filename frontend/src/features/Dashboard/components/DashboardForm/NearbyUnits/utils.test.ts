import { describe, expect, it } from '@jest/globals'

import { getDateRange } from './utils'

import type { Mission } from '../../../../../domain/entities/missions'

describe('getDateRange', () => {
  it('should return correct start and end dates for one mission', () => {
    const missions = [
      {
        endDateTimeUtc: '2023-01-05',
        startDateTimeUtc: '2023-01-01'
      }
    ] as Mission[]
    expect(getDateRange(missions)).toEqual({ end: '05/01/2023', start: '01/01/2023' })
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
    expect(getDateRange(missions)).toEqual({ end: '05/02/2023', start: '01/01/2023' })
  })

  it('should return undefined when there is no endDateTimeUtc', () => {
    const missions = [
      {
        startDateTimeUtc: '2023-01-01'
        // no end date
      }
    ] as Mission[]
    expect(getDateRange(missions)).toEqual({ end: undefined, start: '01/01/2023' })
  })

  it('should return undefined when there is no date', () => {
    const missions = [] as Mission[]
    expect(getDateRange(missions)).toBeUndefined()
  })
})
