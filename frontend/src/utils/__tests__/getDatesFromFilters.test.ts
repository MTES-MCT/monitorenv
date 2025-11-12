import { afterAll, beforeAll, describe, expect, jest } from '@jest/globals'
import { getDatesFromFilters } from '@utils/getDatesFromFilters'

import { DateRangeEnum } from '../../domain/entities/dateRange'

describe('getDatesFromFilters', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-05-13T12:00:00.000Z'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should return default dates when periodFilter is CUSTOM', () => {
    const result = getDatesFromFilters({
      periodFilter: DateRangeEnum.CUSTOM,
      startedAfter: '2024-01-01T00:00:00Z',
      startedBefore: '2024-01-31T00:00:00Z'
    })
    expect(result).toEqual({
      startedAfterDate: '2024-01-01T00:00:00Z',
      startedBeforeDate: '2024-01-31T00:00:00Z'
    })
  })

  it('should calculate DAY range with last 24 hours', () => {
    const result = getDatesFromFilters({
      periodFilter: DateRangeEnum.DAY,
      startedAfter: undefined,
      startedBefore: undefined,
      withLast24Hours: true
    })
    expect(result.startedAfterDate).toBe('2024-05-12T12:00:00.000Z')
    expect(result.startedBeforeDate).toBeUndefined()
  })

  it('should calculate DAY range without last 24 hours', () => {
    const result = getDatesFromFilters({
      periodFilter: DateRangeEnum.DAY,
      startedAfter: undefined,
      startedBefore: undefined
    })
    expect(result.startedAfterDate).toBe('2024-05-13T00:00:00.000Z')
    expect(result.startedBeforeDate).toBe('2024-05-13T23:59:59.999Z')
  })

  it('should calculate WEEK range', () => {
    const result = getDatesFromFilters({
      periodFilter: DateRangeEnum.WEEK,
      startedAfter: undefined,
      startedBefore: undefined
    })
    expect(result.startedAfterDate).toBe('2024-05-06T00:00:00.000Z')
    expect(result.startedBeforeDate).toBe('2024-05-13T23:59:59.999Z')
  })

  it('should calculate MONTH range', () => {
    const result = getDatesFromFilters({
      periodFilter: DateRangeEnum.MONTH,
      startedAfter: undefined,
      startedBefore: undefined
    })
    expect(result.startedAfterDate).toBe('2024-04-13T00:00:00.000Z')
    expect(result.startedBeforeDate).toBe('2024-05-13T23:59:59.999Z')
  })

  it('should calculate YEAR range', () => {
    const result = getDatesFromFilters({
      periodFilter: DateRangeEnum.YEAR,
      startedAfter: undefined,
      startedBefore: undefined
    })
    expect(result.startedAfterDate).toBe('2024-01-01T00:00:00.000Z')
    expect(result.startedBeforeDate).toBeUndefined()
  })
})
