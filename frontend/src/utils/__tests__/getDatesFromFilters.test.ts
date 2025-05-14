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
    const result = getDatesFromFilters('2024-01-01T00:00:00Z', '2024-01-31T00:00:00Z', DateRangeEnum.CUSTOM)
    expect(result).toEqual({
      startedAfterDate: '2024-01-01T00:00:00Z',
      startedBeforeDate: '2024-01-31T00:00:00Z'
    })
  })

  it('should calculate DAY range', () => {
    const result = getDatesFromFilters(undefined, undefined, DateRangeEnum.DAY)
    expect(result.startedAfterDate).toBe('2024-05-12T12:00:00.000Z')
    expect(result.startedBeforeDate).toBeUndefined()
  })

  it('should calculate WEEK range', () => {
    const result = getDatesFromFilters(undefined, undefined, DateRangeEnum.WEEK)
    expect(result.startedAfterDate).toBe('2024-05-06T00:00:00.000Z')
    expect(result.startedBeforeDate).toBeUndefined()
  })

  it('should calculate MONTH range', () => {
    const result = getDatesFromFilters(undefined, undefined, DateRangeEnum.MONTH)
    expect(result.startedAfterDate).toBe('2024-04-13T00:00:00.000Z')
    expect(result.startedBeforeDate).toBeUndefined()
  })

  it('should calculate YEAR range', () => {
    const result = getDatesFromFilters(undefined, undefined, DateRangeEnum.YEAR)
    expect(result.startedAfterDate).toBe('2024-01-01T00:00:00.000Z')
    expect(result.startedBeforeDate).toBeUndefined()
  })
})
