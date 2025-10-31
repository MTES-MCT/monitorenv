import { VigilanceArea } from '@features/VigilanceArea/types'
import { describe, expect, it } from '@jest/globals'
import { customDayjs } from '@mtes-mct/monitor-ui'

import { getFilterVigilanceAreasPerPeriod } from './getFilteredVigilanceAreasPerPeriod'

describe('filterVigilanceAreas', () => {
  const todayMin2Days = {
    computedEndDate: undefined,
    createdAt: undefined,
    endDatePeriod: `${customDayjs().subtract(11, 'day').format('YYYY-MM-DD')} 23:59:59.99999`,
    endingCondition: VigilanceArea.EndingCondition.NEVER,
    endingOccurrenceDate: undefined,
    endingOccurrencesNumber: undefined,
    frequency: VigilanceArea.Frequency.ALL_WEEKS,
    id: 1,
    isArchived: false,
    isAtAllTimes: false,
    isDraft: false,
    name: 'todayMin2Days',
    seaFront: 'MED',
    startDatePeriod: `${customDayjs().subtract(12, 'day').format('YYYY-MM-DD')} 00:00:00.00000`,
    updatedAt: undefined
  }
  const today = {
    computedEndDate: `${customDayjs().add(1, 'year').format('YYYY-MM-DD')} 23:59:59.99999`,
    createdAt: undefined,
    endDatePeriod: `${customDayjs().format('YYYY-MM-DD')} 23:59:59.99999`,
    endingCondition: VigilanceArea.EndingCondition.END_DATE,
    endingOccurrenceDate: `${customDayjs().add(1, 'year').format('YYYY-MM-DD')} 23:59:59.00000`,
    endingOccurrencesNumber: undefined,
    frequency: VigilanceArea.Frequency.ALL_MONTHS,
    id: 2,
    isArchived: false,
    isAtAllTimes: false,
    isDraft: false,
    name: 'Today',
    seaFront: 'MED',
    startDatePeriod: `${customDayjs().format('YYYY-MM-DD')} 00:00:00.00000`,
    updatedAt: undefined
  }
  const quarter = {
    computedEndDate: `${customDayjs().endOf('quarter').add(3, 'weeks').format('YYYY-MM-DD')} 23:59:59.99999`,
    createdAt: undefined,
    endDatePeriod: `${customDayjs().endOf('quarter').format('YYYY-MM-DD')} 23:59:59.99999`,
    endingCondition: VigilanceArea.EndingCondition.OCCURENCES_NUMBER,
    endingOccurrenceDate: undefined,
    endingOccurrencesNumber: 3,
    frequency: VigilanceArea.Frequency.ALL_WEEKS,
    id: 3,
    isArchived: false,
    isAtAllTimes: false,
    isDraft: false,
    name: 'Quarter',
    seaFront: 'MED',
    startDatePeriod: `${customDayjs().startOf('quarter').format('YYYY-MM-DD')} 00:00:00.00000`,
    updatedAt: undefined
  }
  const outsideFilteredDate = {
    computedEndDate: `${customDayjs().add(2, 'year').add(4, 'days').format('YYYY-MM-DD')} 23:59:59.99999`,
    createdAt: undefined,
    endDatePeriod: `${customDayjs()
      .add(1, 'year')
      .add(4, 'months')
      .add(7, 'days')
      .format('YYYY-MM-DD')} 23:59:59.99999`,
    endingCondition: VigilanceArea.EndingCondition.OCCURENCES_NUMBER,
    endingOccurrenceDate: undefined,
    endingOccurrencesNumber: 36,
    frequency: VigilanceArea.Frequency.ALL_WEEKS,
    id: 4,
    isArchived: false,
    isAtAllTimes: false,
    isDraft: false,
    name: 'OutsideFilteredDate',
    seaFront: 'MED',
    startDatePeriod: `${customDayjs().add(1, 'year').add(4, 'months').format('YYYY-MM-DD')} 00:00:00.00000`,
    updatedAt: undefined
  }
  const year = {
    computedEndDate: undefined,
    createdAt: undefined,
    endDatePeriod: `${customDayjs().add(24, 'days').format('YYYY-MM-DD')} 23:59:59.99999`,
    endingCondition: VigilanceArea.EndingCondition.NEVER,
    endingOccurrenceDate: undefined,
    endingOccurrencesNumber: undefined,
    frequency: VigilanceArea.Frequency.ALL_YEARS,
    id: 5,
    isArchived: false,
    isAtAllTimes: false,
    isDraft: false,
    name: 'Year',
    seaFront: 'MED',
    startDatePeriod: `${customDayjs().subtract(3, 'days').format('YYYY-MM-DD')} 00:00:00.00000`,
    updatedAt: undefined
  }
  const allYear = {
    computedEndDate: undefined,
    createdAt: undefined,
    endDatePeriod: `${customDayjs('12/31/2024').format('YYYY-MM-DD')} 23:59:59.99999`,
    endingCondition: VigilanceArea.EndingCondition.NEVER,
    endingOccurrenceDate: undefined,
    endingOccurrencesNumber: undefined,
    frequency: VigilanceArea.Frequency.ALL_YEARS,
    id: 6,
    isArchived: false,
    isAtAllTimes: false,
    isDraft: false,
    name: 'allYear',
    seaFront: 'MED',
    startDatePeriod: `${customDayjs('01/01/2024').format('YYYY-MM-DD')} 00:00:00.00000`,
    updatedAt: undefined
  }

  const infinite = {
    computedEndDate: undefined,
    createdAt: undefined,
    endDatePeriod: undefined,
    endingCondition: undefined,
    endingOccurrenceDate: undefined,
    endingOccurrencesNumber: undefined,
    frequency: undefined,
    id: 7,
    isArchived: false,
    isAtAllTimes: true,
    isDraft: false,
    name: 'Infinite',
    seaFront: 'MED',
    startDatePeriod: `${customDayjs().format('YYYY-MM-DD')} 00:00:00.00000`,
    updatedAt: undefined
  }

  const last3Months = {
    computedEndDate: `${customDayjs().subtract(1, 'month').format('YYYY-MM-DD')} 23:59:59.99999`,
    createdAt: undefined,
    endDatePeriod: `${customDayjs().subtract(1, 'month').format('YYYY-MM-DD')} 23:59:59.99999`,
    endingCondition: VigilanceArea.EndingCondition.END_DATE,
    endingOccurrenceDate: `${customDayjs().subtract(1, 'month').format('YYYY-MM-DD')} 23:59:59.00000`,
    endingOccurrencesNumber: undefined,
    frequency: VigilanceArea.Frequency.ALL_MONTHS,
    id: 8,
    isArchived: false,
    isAtAllTimes: false,
    isDraft: false,
    name: 'Last 3 months',
    seaFront: 'MED',
    startDatePeriod: `${customDayjs().subtract(3, 'month').format('YYYY-MM-DD')} 00:00:00.00000`,
    updatedAt: undefined
  }

  const last12Months = {
    computedEndDate: `${customDayjs().subtract(10, 'months').format('YYYY-MM-DD')} 23:59:59.99999`,
    createdAt: undefined,
    endDatePeriod: `${customDayjs().subtract(10, 'months').format('YYYY-MM-DD')} 23:59:59.99999`,
    endingCondition: VigilanceArea.EndingCondition.END_DATE,
    endingOccurrenceDate: `${customDayjs().subtract(11, 'months').format('YYYY-MM-DD')} 23:59:59.00000`,
    endingOccurrencesNumber: undefined,
    frequency: VigilanceArea.Frequency.ALL_MONTHS,
    id: 9,
    isArchived: false,
    isAtAllTimes: false,
    isDraft: false,
    name: 'Last 12 months',
    seaFront: 'MED',
    startDatePeriod: `${customDayjs().subtract(12, 'months').format('YYYY-MM-DD')} 00:00:00.00000`,
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
    expect(result).toEqual([todayMin2Days, today, quarter, year, allYear, infinite, last3Months, last12Months])
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
      computedEndDate: undefined,
      createdAt: undefined,
      endDatePeriod: '2024-12-31 23:59:59.99999',
      endingCondition: VigilanceArea.EndingCondition.NEVER,
      endingOccurrenceDate: undefined,
      endingOccurrencesNumber: undefined,
      frequency: VigilanceArea.Frequency.ALL_YEARS,
      id: 10,
      isArchived: false,
      isAtAllTimes: false,
      isDraft: false,
      name: 'Today',
      seaFront: 'MED',
      startDatePeriod: '2024-01-01 00:00:00.00000',
      updatedAt: undefined
    }
    const result = getFilterVigilanceAreasPerPeriod(
      [vigilanceAreaOneCompleteYear],
      VigilanceArea.VigilanceAreaFilterPeriod.AT_THE_MOMENT
    )
    expect(result).toEqual([vigilanceAreaOneCompleteYear])
  })
})
