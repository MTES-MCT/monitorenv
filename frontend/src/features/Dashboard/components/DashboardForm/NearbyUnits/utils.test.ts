import { describe, expect, it } from '@jest/globals'

import { getDateRange } from './utils'

import type { Mission } from '../../../../../domain/entities/missions'

describe('getDateRange', () => {
  it('should return correct start and end dates for one mission with one envAction', () => {
    const missions = [
      {
        envActions: [
          {
            actionEndDateTimeUtc: '2023-01-05',
            actionStartDateTimeUtc: '2023-01-01'
          }
        ]
      }
    ] as Mission[]
    expect(getDateRange(missions)).toEqual({ end: '05/01/2023', start: '01/01/2023' })
  })

  it('should handle multiple envActions per mission', () => {
    const missions = [
      {
        envActions: [
          {
            actionEndDateTimeUtc: '2023-01-12',
            actionStartDateTimeUtc: '2023-01-10'
          },
          {
            actionEndDateTimeUtc: '2023-01-02',
            actionStartDateTimeUtc: '2023-01-01'
          }
        ]
      }
    ] as Mission[]
    expect(getDateRange(missions)).toEqual({ end: '12/01/2023', start: '01/01/2023' })
  })

  it('should return global start and end for multiple missions', () => {
    const missions = [
      {
        envActions: [
          {
            actionEndDateTimeUtc: '2023-02-05',
            actionStartDateTimeUtc: '2023-02-01'
          }
        ]
      },
      {
        envActions: [
          {
            actionEndDateTimeUtc: '2023-01-15',
            actionStartDateTimeUtc: '2023-01-01'
          }
        ]
      }
    ] as Mission[]
    expect(getDateRange(missions)).toEqual({ end: '05/02/2023', start: '01/01/2023' })
  })

  it('should return undefined when there is no actionEndDateTimeUtc', () => {
    const missions = [
      {
        envActions: [
          {
            actionStartDateTimeUtc: '2023-01-01'
            // no end date
          }
        ]
      }
    ] as Mission[]
    expect(getDateRange(missions)).toEqual({ end: undefined, start: '01/01/2023' })
  })

  it('should return undefined when there is no date', () => {
    const missions = [
      {
        envActions: [
          {
            // no date
          }
        ]
      }
    ] as Mission[]
    expect(getDateRange(missions)).toEqual({ end: undefined, start: undefined })
  })
})
