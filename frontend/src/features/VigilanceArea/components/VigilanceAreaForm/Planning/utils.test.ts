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
        end: customDayjs(vigilanceArea.endDatePeriod),
        start: customDayjs(vigilanceArea.startDatePeriod)
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
})
