import { afterAll, beforeAll, describe, expect, jest } from '@jest/globals'

import { getNbMonths } from '../getNbMonths'

beforeAll(() => {
  jest.useFakeTimers().setSystemTime(new Date('2025-07-21T00:00:00Z'))
})

afterAll(() => {
  jest.useRealTimers()
})

describe('getNbMonths', () => {
  it('returns 0 if the date is today', () => {
    expect(getNbMonths('2025-07-21')).toBe(0)
  })

  it('returns 1 if the date is one month ago with an earlier day', () => {
    expect(getNbMonths('2025-06-20')).toBe(1)
  })

  it('returns 0 if the date is one month ago with a later day', () => {
    expect(getNbMonths('2025-06-22')).toBe(0)
  })

  it('returns 12 if the date is exactly one year ago', () => {
    expect(getNbMonths('2024-07-21')).toBe(12)
  })

  it('returns 13 if the date is one year and a month ago with a earlier day', () => {
    expect(getNbMonths('2024-06-20')).toBe(13)
  })
})
