import { expect } from '@jest/globals'
import { customDayjs } from '@mtes-mct/monitor-ui'

import { getPreviousMonthUTC, todayUTC } from './dates'

describe('todayUTC', () => {
  it('should return the time of the day in UTC format', () => {
    // When
    const today = todayUTC()

    // Then
    const todayExpected = `${new Date().toISOString().split('.')[0]}Z`
    expect(todayExpected).toEqual(today)
  })
})

describe('getPreviousMonthUTC', () => {
  it('should return the previous month from the date in UTC format', () => {
    // Given
    const previousNumberOfMonths = 2
    const from = customDayjs.utc('2024-04-23')

    // When
    const previousDate = getPreviousMonthUTC(previousNumberOfMonths, from)

    // Then
    const dateExpected = `${new Date('2024-02-23').toISOString().split('.')[0]}Z`
    expect(dateExpected).toEqual(previousDate)
  })
})
