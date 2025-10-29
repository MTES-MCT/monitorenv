import { VigilanceArea } from '@features/VigilanceArea/types'
import { describe, expect, it } from '@jest/globals'
import { customDayjs } from '@mtes-mct/monitor-ui'

import { getFilterVigilanceAreasPerPeriod } from './getFilteredVigilanceAreasPerPeriod'

describe('filterVigilanceAreas', () => {
  const todayMin2Days = {
    createdAt: undefined,
    id: 1,
    isAtAllTimes: false,
    isDraft: false,
    name: 'todayMin2Days',
    periods: [
      {
        computedEndDate: undefined,
        endDatePeriod: `${customDayjs().subtract(11, 'day').format('YYYY-MM-DD')} 23:59:59.99999`,
        endingCondition: VigilanceArea.EndingCondition.NEVER,
        endingOccurrenceDate: undefined,
        endingOccurrencesNumber: undefined,
        frequency: VigilanceArea.Frequency.ALL_WEEKS,
        isAtAllTimes: false,
        startDatePeriod: `${customDayjs().subtract(12, 'day').format('YYYY-MM-DD')} 00:00:00.00000`
      }
    ],
    seaFront: 'MED',
    updatedAt: undefined
  }
  const today = {
    createdAt: undefined,
    id: 2,
    isAtAllTimes: false,
    isDraft: false,
    name: 'Today',
    periods: [
      {
        computedEndDate: `${customDayjs().add(1, 'year').format('YYYY-MM-DD')} 23:59:59.99999`,
        endDatePeriod: `${customDayjs().format('YYYY-MM-DD')} 23:59:59.99999`,
        endingCondition: VigilanceArea.EndingCondition.END_DATE,
        endingOccurrenceDate: `${customDayjs().add(1, 'year').format('YYYY-MM-DD')} 23:59:59.00000`,
        endingOccurrencesNumber: undefined,
        frequency: VigilanceArea.Frequency.ALL_MONTHS,
        isAtAllTimes: false,
        startDatePeriod: `${customDayjs().format('YYYY-MM-DD')} 00:00:00.00000`
      }
    ],
    seaFront: 'MED',
    updatedAt: undefined
  }
  const quarter = {
    createdAt: undefined,
    id: 3,
    isDraft: false,
    name: 'Quarter',
    periods: [
      {
        computedEndDate: `${customDayjs().endOf('quarter').add(3, 'weeks').format('YYYY-MM-DD')} 23:59:59.99999`,
        endDatePeriod: `${customDayjs().endOf('quarter').format('YYYY-MM-DD')} 23:59:59.99999`,
        endingCondition: VigilanceArea.EndingCondition.OCCURENCES_NUMBER,
        endingOccurrenceDate: undefined,
        endingOccurrencesNumber: 3,
        frequency: VigilanceArea.Frequency.ALL_WEEKS,
        isAtAllTimes: false,
        startDatePeriod: `${customDayjs().startOf('quarter').format('YYYY-MM-DD')} 00:00:00.00000`
      }
    ],
    seaFront: 'MED',
    updatedAt: undefined
  }
  const outsideFilteredDate = {
    createdAt: undefined,
    id: 4,
    isDraft: false,
    name: 'OutsideFilteredDate',
    periods: [
      {
        computedEndDate: `${customDayjs().add(2, 'year').add(4, 'days').format('YYYY-MM-DD')} 23:59:59.99999`,
        endDatePeriod: `${customDayjs()
          .add(1, 'year')
          .add(4, 'months')
          .add(7, 'days')
          .format('YYYY-MM-DD')} 23:59:59.99999`,
        endingCondition: VigilanceArea.EndingCondition.OCCURENCES_NUMBER,
        endingOccurrenceDate: undefined,
        endingOccurrencesNumber: 36,
        frequency: VigilanceArea.Frequency.ALL_WEEKS,
        isAtAllTimes: false,
        startDatePeriod: `${customDayjs().add(1, 'year').add(4, 'months').format('YYYY-MM-DD')} 00:00:00.00000`
      }
    ],
    seaFront: 'MED',
    updatedAt: undefined
  }
  const year = {
    createdAt: undefined,
    id: 5,
    isDraft: false,
    name: 'Year',
    periods: [
      {
        endDatePeriod: `${customDayjs().add(24, 'days').format('YYYY-MM-DD')} 23:59:59.99999`,
        endingCondition: VigilanceArea.EndingCondition.NEVER,
        endingOccurrenceDate: undefined,
        endingOccurrencesNumber: undefined,
        frequency: VigilanceArea.Frequency.ALL_YEARS,
        isAtAllTimes: false,
        startDatePeriod: `${customDayjs().subtract(3, 'days').format('YYYY-MM-DD')} 00:00:00.00000`
      }
    ],
    seaFront: 'MED',
    updatedAt: undefined
  }
  const allYear = {
    createdAt: undefined,

    id: 6,
    isDraft: false,
    name: 'allYear',
    periods: [
      {
        computedEndDate: undefined,
        endDatePeriod: `${customDayjs('12/31/2024').format('YYYY-MM-DD')} 23:59:59.99999`,
        endingCondition: VigilanceArea.EndingCondition.NEVER,
        endingOccurrenceDate: undefined,
        endingOccurrencesNumber: undefined,
        frequency: VigilanceArea.Frequency.ALL_YEARS,
        isAtAllTimes: false,
        startDatePeriod: `${customDayjs('01/01/2024').format('YYYY-MM-DD')} 00:00:00.00000`
      }
    ],
    seaFront: 'MED',
    updatedAt: undefined
  }

  const infinite = {
    createdAt: undefined,
    id: 7,
    isDraft: false,
    name: 'Infinite',
    periods: [
      {
        computedEndDate: undefined,
        endDatePeriod: undefined,
        endingCondition: undefined,
        endingOccurrenceDate: undefined,
        endingOccurrencesNumber: undefined,
        frequency: undefined,
        isAtAllTimes: true,
        startDatePeriod: `${customDayjs().format('YYYY-MM-DD')} 00:00:00.00000`
      }
    ],
    seaFront: 'MED',
    updatedAt: undefined
  }

  const last3Months = {
    createdAt: undefined,
    id: 8,
    isDraft: false,
    name: 'Last 3 months',
    periods: [
      {
        computedEndDate: `${customDayjs().subtract(1, 'month').format('YYYY-MM-DD')} 23:59:59.99999`,
        endDatePeriod: `${customDayjs().subtract(1, 'month').format('YYYY-MM-DD')} 23:59:59.99999`,
        endingCondition: VigilanceArea.EndingCondition.END_DATE,
        endingOccurrenceDate: `${customDayjs().subtract(1, 'month').format('YYYY-MM-DD')} 23:59:59.00000`,
        endingOccurrencesNumber: undefined,
        frequency: VigilanceArea.Frequency.ALL_MONTHS,
        isAtAllTimes: false,
        startDatePeriod: `${customDayjs().subtract(3, 'month').format('YYYY-MM-DD')} 00:00:00.00000`
      }
    ],
    seaFront: 'MED',
    updatedAt: undefined
  }

  const last12Months = {
    createdAt: undefined,
    id: 9,
    isAtAllTimes: false,
    isDraft: false,
    name: 'Last 12 months',
    periods: [
      {
        computedEndDate: `${customDayjs().subtract(10, 'months').format('YYYY-MM-DD')} 23:59:59.99999`,
        endDatePeriod: `${customDayjs().subtract(10, 'months').format('YYYY-MM-DD')} 23:59:59.99999`,
        endingCondition: VigilanceArea.EndingCondition.END_DATE,
        endingOccurrenceDate: `${customDayjs().subtract(11, 'months').format('YYYY-MM-DD')} 23:59:59.00000`,
        endingOccurrencesNumber: undefined,
        frequency: VigilanceArea.Frequency.ALL_MONTHS,
        isAtAllTimes: false,
        startDatePeriod: `${customDayjs().subtract(12, 'months').format('YYYY-MM-DD')} 00:00:00.00000`
      }
    ],
    seaFront: 'MED',
    updatedAt: undefined
  }

  const areas = [todayMin2Days, today, quarter, year, allYear, outsideFilteredDate, infinite, last3Months, last12Months]

  it('filters areas for today', () => {
    const result = getFilterVigilanceAreasPerPeriod(areas, VigilanceArea.VigilanceAreaFilterPeriod.AT_THE_MOMENT)
    expect(result).toEqual([today, quarter, year, allYear, infinite])
  })

  it('filters areas within current quarter', () => {
    const result = getFilterVigilanceAreasPerPeriod(areas, VigilanceArea.VigilanceAreaFilterPeriod.CURRENT_QUARTER)
    expect(result).toEqual([todayMin2Days, today, quarter, year, allYear, infinite, last3Months])
  })

  it('filters areas within current year', () => {
    const result = getFilterVigilanceAreasPerPeriod(areas, VigilanceArea.VigilanceAreaFilterPeriod.CURRENT_YEAR)
    expect(result).toEqual([todayMin2Days, today, quarter, year, allYear, infinite])
  })

  it('filters areas within next three months', () => {
    const result = getFilterVigilanceAreasPerPeriod(areas, VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS)
    expect(result).toEqual([todayMin2Days, today, quarter, year, allYear, infinite])
  })

  it('filters areas within last three months', () => {
    const result = getFilterVigilanceAreasPerPeriod(areas, VigilanceArea.VigilanceAreaFilterPeriod.LAST_THREE_MONTHS)
    expect(result).toEqual([todayMin2Days, quarter, year, allYear, infinite, last3Months])
  })

  it('filters areas within last twelve months', () => {
    const result = getFilterVigilanceAreasPerPeriod(areas, VigilanceArea.VigilanceAreaFilterPeriod.LAST_TWELVE_MONTHS)
    expect(result).toEqual([todayMin2Days, quarter, year, allYear, infinite, last3Months, last12Months])
  })
  it('filters areas with vigilance area one complete year', () => {
    const vigilanceAreaOneCompleteYear = {
      createdAt: undefined,
      id: 10,
      isArchived: false,
      isDraft: false,
      name: 'Today',
      periods: [
        {
          computedEndDate: undefined,
          endDatePeriod: '2024-12-31 23:59:59.99999',
          endingCondition: VigilanceArea.EndingCondition.NEVER,
          endingOccurrenceDate: undefined,
          endingOccurrencesNumber: undefined,
          frequency: VigilanceArea.Frequency.ALL_YEARS,
          isAtAllTimes: false,
          startDatePeriod: '2024-01-01 00:00:00.00000'
        }
      ],
      seaFront: 'MED',
      updatedAt: undefined
    }
    const result = getFilterVigilanceAreasPerPeriod(
      [vigilanceAreaOneCompleteYear],
      VigilanceArea.VigilanceAreaFilterPeriod.AT_THE_MOMENT
    )
    expect(result).toEqual([vigilanceAreaOneCompleteYear])
  })
})
