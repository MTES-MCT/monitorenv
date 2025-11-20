import { computeOccurenceWithinCurrentYear } from '@features/VigilanceArea/components/VigilanceAreaForm/Planning/utils'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { describe, expect, it, jest } from '@jest/globals'
import { customDayjs } from '@mtes-mct/monitor-ui'

describe('computeOccurenceWithinCurrentYear should return all occurences that match the given vigilance area', () => {
  it('it should return whole year when is at all times', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-05-13T12:00:00.000Z'))

    const vigilanceArea: VigilanceArea.VigilanceArea = {
      isArchived: false,
      isAtAllTimes: true,
      isDraft: false,
      name: undefined,
      seaFront: undefined
    }
    const occurenceDates = computeOccurenceWithinCurrentYear(vigilanceArea)
    jest.useRealTimers()
    expect(occurenceDates).toEqual([
      { end: customDayjs('2024-12-31T23:59:59.999Z').utc(), start: customDayjs('2024-01-01T00:00:00.000Z').utc() }
    ])
  })
  it('it should return empty when there is no starting date', () => {
    const vigilanceArea: VigilanceArea.VigilanceArea = {
      isArchived: false,
      isAtAllTimes: false,
      isDraft: false,
      name: undefined,
      seaFront: undefined
    }
    const occurenceDates = computeOccurenceWithinCurrentYear(vigilanceArea)
    expect(occurenceDates).toEqual([])
  })

  it('it should return startDatePeriod and endDatePeriod when frequency is NONE', () => {
    const vigilanceArea: VigilanceArea.VigilanceArea = {
      endDatePeriod: '2025-04-19T00:00:00.000Z',
      frequency: VigilanceArea.Frequency.NONE,
      isArchived: false,
      isAtAllTimes: false,
      isDraft: false,
      name: undefined,
      seaFront: undefined,
      startDatePeriod: '2025-01-01T00:00:00.000Z'
    }
    const occurenceDates = computeOccurenceWithinCurrentYear(vigilanceArea)
    expect(occurenceDates).toEqual([
      {
        end: customDayjs(vigilanceArea.endDatePeriod).utc(),
        start: customDayjs(vigilanceArea.startDatePeriod).utc()
      }
    ])
  })
  it('it should return date range of the current year when frequency is ALL_YEARS', () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T12:00:00.000Z'))
    const vigilanceArea: VigilanceArea.VigilanceArea = {
      endDatePeriod: '2023-04-19T00:00:00.000Z',
      endingCondition: VigilanceArea.EndingCondition.NEVER,
      frequency: VigilanceArea.Frequency.ALL_YEARS,
      isArchived: false,
      isAtAllTimes: false,
      isDraft: false,
      name: undefined,
      seaFront: undefined,
      startDatePeriod: '2023-01-01T00:00:00.000Z'
    }
    const occurenceDates = computeOccurenceWithinCurrentYear(vigilanceArea)
    jest.useRealTimers()
    expect(occurenceDates).toEqual([
      {
        end: customDayjs('2025-04-19T00:00:00.000Z').utc(),
        start: customDayjs('2025-01-01T00:00:00.000Z').utc()
      }
    ])
  })
  it('it should return date range of the current year when frequency is ALL_WEEKS', () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T12:00:00.000Z'))
    const vigilanceArea: VigilanceArea.VigilanceArea = {
      endDatePeriod: '2023-11-13T00:00:00.000Z',
      endingCondition: VigilanceArea.EndingCondition.NEVER,
      frequency: VigilanceArea.Frequency.ALL_WEEKS,
      isArchived: false,
      isAtAllTimes: false,
      isDraft: false,
      name: undefined,
      seaFront: undefined,
      startDatePeriod: '2023-11-12T00:00:00.000Z'
    }
    const occurenceDates = computeOccurenceWithinCurrentYear(vigilanceArea)
    jest.useRealTimers()
    expect(occurenceDates).toEqual([
      {
        end: customDayjs('2025-01-06T00:00:00.000Z').utc(),
        start: customDayjs('2025-01-05T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-01-13T00:00:00.000Z').utc(),
        start: customDayjs('2025-01-12T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-01-20T00:00:00.000Z').utc(),
        start: customDayjs('2025-01-19T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-01-27T00:00:00.000Z').utc(),
        start: customDayjs('2025-01-26T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-02-03T00:00:00.000Z').utc(),
        start: customDayjs('2025-02-02T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-02-10T00:00:00.000Z').utc(),
        start: customDayjs('2025-02-09T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-02-17T00:00:00.000Z').utc(),
        start: customDayjs('2025-02-16T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-02-24T00:00:00.000Z').utc(),
        start: customDayjs('2025-02-23T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-03-03T00:00:00.000Z').utc(),
        start: customDayjs('2025-03-02T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-03-10T00:00:00.000Z').utc(),
        start: customDayjs('2025-03-09T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-03-17T00:00:00.000Z').utc(),
        start: customDayjs('2025-03-16T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-03-24T00:00:00.000Z').utc(),
        start: customDayjs('2025-03-23T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-03-31T00:00:00.000Z').utc(),
        start: customDayjs('2025-03-30T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-04-07T00:00:00.000Z').utc(),
        start: customDayjs('2025-04-06T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-04-14T00:00:00.000Z').utc(),
        start: customDayjs('2025-04-13T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-04-21T00:00:00.000Z').utc(),
        start: customDayjs('2025-04-20T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-04-28T00:00:00.000Z').utc(),
        start: customDayjs('2025-04-27T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-05-05T00:00:00.000Z').utc(),
        start: customDayjs('2025-05-04T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-05-12T00:00:00.000Z').utc(),
        start: customDayjs('2025-05-11T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-05-19T00:00:00.000Z').utc(),
        start: customDayjs('2025-05-18T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-05-26T00:00:00.000Z').utc(),
        start: customDayjs('2025-05-25T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-06-02T00:00:00.000Z').utc(),
        start: customDayjs('2025-06-01T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-06-09T00:00:00.000Z').utc(),
        start: customDayjs('2025-06-08T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-06-16T00:00:00.000Z').utc(),
        start: customDayjs('2025-06-15T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-06-23T00:00:00.000Z').utc(),
        start: customDayjs('2025-06-22T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-06-30T00:00:00.000Z').utc(),
        start: customDayjs('2025-06-29T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-07-07T00:00:00.000Z').utc(),
        start: customDayjs('2025-07-06T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-07-14T00:00:00.000Z').utc(),
        start: customDayjs('2025-07-13T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-07-21T00:00:00.000Z').utc(),
        start: customDayjs('2025-07-20T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-07-28T00:00:00.000Z').utc(),
        start: customDayjs('2025-07-27T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-08-04T00:00:00.000Z').utc(),
        start: customDayjs('2025-08-03T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-08-11T00:00:00.000Z').utc(),
        start: customDayjs('2025-08-10T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-08-18T00:00:00.000Z').utc(),
        start: customDayjs('2025-08-17T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-08-25T00:00:00.000Z').utc(),
        start: customDayjs('2025-08-24T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-09-01T00:00:00.000Z').utc(),
        start: customDayjs('2025-08-31T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-09-08T00:00:00.000Z').utc(),
        start: customDayjs('2025-09-07T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-09-15T00:00:00.000Z').utc(),
        start: customDayjs('2025-09-14T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-09-22T00:00:00.000Z').utc(),
        start: customDayjs('2025-09-21T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-09-29T00:00:00.000Z').utc(),
        start: customDayjs('2025-09-28T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-10-06T00:00:00.000Z').utc(),
        start: customDayjs('2025-10-05T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-10-13T00:00:00.000Z').utc(),
        start: customDayjs('2025-10-12T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-10-20T00:00:00.000Z').utc(),
        start: customDayjs('2025-10-19T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-10-27T00:00:00.000Z').utc(),
        start: customDayjs('2025-10-26T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-11-03T00:00:00.000Z').utc(),
        start: customDayjs('2025-11-02T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-11-10T00:00:00.000Z').utc(),
        start: customDayjs('2025-11-09T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-11-17T00:00:00.000Z').utc(),
        start: customDayjs('2025-11-16T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-11-24T00:00:00.000Z').utc(),
        start: customDayjs('2025-11-23T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-12-01T00:00:00.000Z').utc(),
        start: customDayjs('2025-11-30T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-12-08T00:00:00.000Z').utc(),
        start: customDayjs('2025-12-07T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-12-15T00:00:00.000Z').utc(),
        start: customDayjs('2025-12-14T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-12-22T00:00:00.000Z').utc(),
        start: customDayjs('2025-12-21T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-12-29T00:00:00.000Z').utc(),
        start: customDayjs('2025-12-28T00:00:00.000Z').utc()
      }
    ])
  })
})
