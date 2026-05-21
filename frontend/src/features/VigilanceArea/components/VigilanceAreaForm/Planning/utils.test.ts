import {
  computeOccurenceWithinCurrentYear,
  isDayInCriticalPeriod,
  isDayInPeriod,
  isEnd,
  isStart
} from '@features/VigilanceArea/components/VigilanceAreaForm/Planning/utils'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { describe, expect, it, jest } from '@jest/globals'
import { customDayjs } from '@mtes-mct/monitor-ui'

describe('computeOccurenceWithinCurrentYear should return all occurences that match the given vigilance area', () => {
  it('it should return whole year when is at all times', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-05-13T12:00:00.000Z'))

    const vigilanceArea: VigilanceArea.VigilanceArea = {
      isDraft: false,
      name: undefined,
      periods: [
        {
          isAtAllTimes: true
        }
      ],
      seaFront: undefined
    }
    const occurenceDates = computeOccurenceWithinCurrentYear(vigilanceArea.periods![0]!)
    jest.useRealTimers()
    expect(occurenceDates).toEqual([
      {
        end: customDayjs('2024-12-31T23:59:59.999Z').utc(),
        isCritical: undefined,
        start: customDayjs('2024-01-01T00:00:00.000Z').utc()
      }
    ])
  })
  it('it should return empty when there is no starting date', () => {
    const vigilanceArea: VigilanceArea.VigilanceArea = {
      isDraft: false,
      name: undefined,
      periods: [
        {
          isAtAllTimes: false
        }
      ],
      seaFront: undefined
    }
    const occurenceDates = computeOccurenceWithinCurrentYear(vigilanceArea.periods![0]!)
    expect(occurenceDates).toEqual([])
  })

  it('it should return startDatePeriod and endDatePeriod when frequency is NONE', () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T12:00:00.000Z'))
    const vigilanceArea: VigilanceArea.VigilanceArea = {
      isDraft: false,
      name: undefined,
      periods: [
        {
          endDatePeriod: '2025-04-19T00:00:00.000Z',
          frequency: VigilanceArea.Frequency.NONE,
          isAtAllTimes: false,
          startDatePeriod: '2025-01-01T00:00:00.000Z'
        }
      ],
      seaFront: undefined
    }
    const occurenceDates = computeOccurenceWithinCurrentYear(vigilanceArea.periods![0]!)
    jest.useRealTimers()
    expect(occurenceDates).toEqual([
      {
        end: customDayjs('2025-04-19T00:00:00.000Z').utc(),
        isCritical: undefined,
        start: customDayjs('2025-01-01T00:00:00.000Z').utc()
      }
    ])
  })
  it('it should return date range of the current year when frequency is ALL_YEARS', () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T12:00:00.000Z'))
    const vigilanceArea: VigilanceArea.VigilanceArea = {
      isDraft: false,
      name: undefined,
      periods: [
        {
          endDatePeriod: '2023-04-19T00:00:00.000Z',
          endingCondition: VigilanceArea.EndingCondition.NEVER,
          frequency: VigilanceArea.Frequency.ALL_YEARS,
          isAtAllTimes: false,
          startDatePeriod: '2023-01-01T00:00:00.000Z'
        }
      ],
      seaFront: undefined
    }
    const occurenceDates = computeOccurenceWithinCurrentYear(vigilanceArea.periods![0]!)
    jest.useRealTimers()
    expect(occurenceDates).toEqual([
      {
        end: customDayjs('2025-04-19T00:00:00.000Z').utc(),
        isCritical: undefined,
        start: customDayjs('2025-01-01T00:00:00.000Z').utc()
      }
    ])
  })
  it('it should return date range of the current year when frequency is ALL_WEEKS with occurences number', () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T12:00:00.000Z'))
    const vigilanceArea: VigilanceArea.VigilanceArea = {
      isDraft: false,
      name: undefined,
      periods: [
        {
          endDatePeriod: '2023-11-13T00:00:00.000Z',
          endingCondition: VigilanceArea.EndingCondition.OCCURENCES_NUMBER,
          endingOccurrencesNumber: 66,
          frequency: VigilanceArea.Frequency.ALL_WEEKS,
          isAtAllTimes: false,
          startDatePeriod: '2023-11-12T00:00:00.000Z'
        }
      ],
      seaFront: undefined
    }
    const occurenceDates = computeOccurenceWithinCurrentYear(vigilanceArea.periods![0]!)
    jest.useRealTimers()
    expect(occurenceDates).toEqual([
      {
        end: customDayjs('2025-01-06T00:00:00.000Z').utc(),
        isCritical: undefined,
        start: customDayjs('2025-01-05T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-01-13T00:00:00.000Z').utc(),
        isCritical: undefined,
        start: customDayjs('2025-01-12T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-01-20T00:00:00.000Z').utc(),
        isCritical: undefined,
        start: customDayjs('2025-01-19T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-01-27T00:00:00.000Z').utc(),
        isCritical: undefined,
        start: customDayjs('2025-01-26T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-02-03T00:00:00.000Z').utc(),
        isCritical: undefined,
        start: customDayjs('2025-02-02T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-02-10T00:00:00.000Z').utc(),
        isCritical: undefined,
        start: customDayjs('2025-02-09T00:00:00.000Z').utc()
      }
    ])
  })

  it('it should return empty when frequency is ALL_WEEKS out of the current year', () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T12:00:00.000Z'))
    const vigilanceArea: VigilanceArea.VigilanceArea = {
      isDraft: false,
      name: undefined,
      periods: [
        {
          endDatePeriod: '2023-11-13T00:00:00.000Z',
          endingCondition: VigilanceArea.EndingCondition.OCCURENCES_NUMBER,
          frequency: VigilanceArea.Frequency.NONE,
          isAtAllTimes: false,
          startDatePeriod: '2023-11-12T00:00:00.000Z'
        }
      ],
      seaFront: undefined
    }
    const occurenceDates = computeOccurenceWithinCurrentYear(vigilanceArea.periods![0]!)
    jest.useRealTimers()
    expect(occurenceDates).toEqual([])
  })

  it('it should return date range until the given date when frequency is ALL_WEEKS and ending is a date', () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T12:00:00.000Z'))
    const vigilanceArea: VigilanceArea.VigilanceArea = {
      isDraft: false,
      name: undefined,
      periods: [
        {
          endDatePeriod: '2023-11-13T00:00:00.000Z',
          endingCondition: VigilanceArea.EndingCondition.END_DATE,
          endingOccurrenceDate: '2025-01-10T12:00:00.000Z',
          frequency: VigilanceArea.Frequency.ALL_WEEKS,
          isAtAllTimes: false,
          startDatePeriod: '2023-11-12T00:00:00.000Z'
        }
      ],
      seaFront: undefined
    }
    const occurenceDates = computeOccurenceWithinCurrentYear(vigilanceArea.periods![0]!)
    jest.useRealTimers()
    expect(occurenceDates).toEqual([
      {
        end: customDayjs('2025-01-06T00:00:00.000Z').utc(),
        isCritical: undefined,
        start: customDayjs('2025-01-05T00:00:00.000Z').utc()
      }
    ])
  })
})

describe('isDayInPeriod', () => {
  const month = customDayjs('2025-06-01T00:00:00.000Z').utc()
  const dateRanges = [
    {
      end: customDayjs('2025-06-15T00:00:00.000Z').utc(),
      isCritical: false,
      start: customDayjs('2025-06-10T00:00:00.000Z').utc()
    }
  ]

  it('should return true for a day inside the range', () => {
    expect(isDayInPeriod(12, month, dateRanges)).toBe(true)
  })

  it('should return true for the start day of the range', () => {
    expect(isDayInPeriod(10, month, dateRanges)).toBe(true)
  })

  it('should return true for the end day of the range', () => {
    expect(isDayInPeriod(15, month, dateRanges)).toBe(true)
  })

  it('should return false for a day before the range', () => {
    expect(isDayInPeriod(5, month, dateRanges)).toBe(false)
  })

  it('should return false for a day after the range', () => {
    expect(isDayInPeriod(20, month, dateRanges)).toBe(false)
  })

  it('should return false for an empty dateRanges array', () => {
    expect(isDayInPeriod(12, month, [])).toBe(false)
  })

  it('should return true if day is in at least one of multiple ranges', () => {
    const multipleRanges = [
      {
        end: customDayjs('2025-06-05T00:00:00.000Z').utc(),
        isCritical: false,
        start: customDayjs('2025-06-01T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-06-25T00:00:00.000Z').utc(),
        isCritical: false,
        start: customDayjs('2025-06-20T00:00:00.000Z').utc()
      }
    ]
    expect(isDayInPeriod(22, month, multipleRanges)).toBe(true)
  })
})

describe('isDayInCriticalPeriod', () => {
  const month = customDayjs('2025-06-01T00:00:00.000Z').utc()

  it('should return true for a day in a critical range', () => {
    const dateRanges = [
      {
        end: customDayjs('2025-06-15T00:00:00.000Z').utc(),
        isCritical: true,
        start: customDayjs('2025-06-10T00:00:00.000Z').utc()
      }
    ]
    expect(isDayInCriticalPeriod(12, month, dateRanges)).toBe(true)
  })

  it('should return false for a day in a non-critical range', () => {
    const dateRanges = [
      {
        end: customDayjs('2025-06-15T00:00:00.000Z').utc(),
        isCritical: false,
        start: customDayjs('2025-06-10T00:00:00.000Z').utc()
      }
    ]
    expect(isDayInCriticalPeriod(12, month, dateRanges)).toBe(false)
  })

  it('should return false for a day not in any range', () => {
    const dateRanges = [
      {
        end: customDayjs('2025-06-15T00:00:00.000Z').utc(),
        isCritical: true,
        start: customDayjs('2025-06-10T00:00:00.000Z').utc()
      }
    ]
    expect(isDayInCriticalPeriod(5, month, dateRanges)).toBe(false)
  })

  it('should return false for an empty dateRanges array', () => {
    expect(isDayInCriticalPeriod(12, month, [])).toBe(false)
  })

  it('should return true if day is in at least one critical range among mixed ranges', () => {
    const dateRanges = [
      {
        end: customDayjs('2025-06-05T00:00:00.000Z').utc(),
        isCritical: false,
        start: customDayjs('2025-06-01T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-06-25T00:00:00.000Z').utc(),
        isCritical: true,
        start: customDayjs('2025-06-20T00:00:00.000Z').utc()
      }
    ]
    expect(isDayInCriticalPeriod(22, month, dateRanges)).toBe(true)
  })
})

describe('isStart', () => {
  const month = customDayjs('2025-06-01T00:00:00.000Z').utc()
  const dateRanges = [
    {
      end: customDayjs('2025-06-15T00:00:00.000Z').utc(),
      isCritical: false,
      start: customDayjs('2025-06-10T00:00:00.000Z').utc()
    }
  ]

  it('should return true for the start day of a range', () => {
    expect(isStart(10, month, dateRanges)).toBe(true)
  })

  it('should return false for a day inside the range but not the start', () => {
    expect(isStart(12, month, dateRanges)).toBe(false)
  })

  it('should return false for the end day of the range', () => {
    expect(isStart(15, month, dateRanges)).toBe(false)
  })

  it('should return false for a day outside the range', () => {
    expect(isStart(5, month, dateRanges)).toBe(false)
  })

  it('should return false for an empty dateRanges array', () => {
    expect(isStart(10, month, [])).toBe(false)
  })

  it('should return true if day matches start of any range', () => {
    const multipleRanges = [
      {
        end: customDayjs('2025-06-05T00:00:00.000Z').utc(),
        isCritical: false,
        start: customDayjs('2025-06-01T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-06-25T00:00:00.000Z').utc(),
        isCritical: false,
        start: customDayjs('2025-06-20T00:00:00.000Z').utc()
      }
    ]
    expect(isStart(20, month, multipleRanges)).toBe(true)
  })
})

describe('isEnd', () => {
  const month = customDayjs('2025-06-01T00:00:00.000Z').utc()
  const dateRanges = [
    {
      end: customDayjs('2025-06-15T00:00:00.000Z').utc(),
      isCritical: false,
      start: customDayjs('2025-06-10T00:00:00.000Z').utc()
    }
  ]

  it('should return true for the end day of a range', () => {
    expect(isEnd(15, month, dateRanges)).toBe(true)
  })

  it('should return false for a day inside the range but not the end', () => {
    expect(isEnd(12, month, dateRanges)).toBe(false)
  })

  it('should return false for the start day of the range', () => {
    expect(isEnd(10, month, dateRanges)).toBe(false)
  })

  it('should return false for a day outside the range', () => {
    expect(isEnd(20, month, dateRanges)).toBe(false)
  })

  it('should return false for an empty dateRanges array', () => {
    expect(isEnd(15, month, [])).toBe(false)
  })

  it('should return true if day matches end of any range', () => {
    const multipleRanges = [
      {
        end: customDayjs('2025-06-05T00:00:00.000Z').utc(),
        isCritical: false,
        start: customDayjs('2025-06-01T00:00:00.000Z').utc()
      },
      {
        end: customDayjs('2025-06-25T00:00:00.000Z').utc(),
        isCritical: false,
        start: customDayjs('2025-06-20T00:00:00.000Z').utc()
      }
    ]
    expect(isEnd(5, month, multipleRanges)).toBe(true)
  })
})
