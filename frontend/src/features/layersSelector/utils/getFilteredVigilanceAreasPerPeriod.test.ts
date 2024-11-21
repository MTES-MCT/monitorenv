import { VigilanceArea } from '@features/VigilanceArea/types'
import { describe, expect, it } from '@jest/globals'
import { customDayjs } from '@mtes-mct/monitor-ui'

import { getFilterVigilanceAreasPerPeriod } from './getFilteredVigilanceAreasPerPeriod'

describe('filterVigilanceAreas', () => {
  const today = {
    computedEndDate: `${customDayjs().add(1, 'year').format('YYYY-MM-DD')} 23:59:59.99999`,
    endDatePeriod: `${customDayjs().format('YYYY-MM-DD')} 23:59:59.99999`,
    endingCondition: VigilanceArea.EndingCondition.END_DATE,
    endingOccurrenceDate: `${customDayjs().add(1, 'year').format('YYYY-MM-DD')} 23:59:59.00000`,
    endingOccurrencesNumber: undefined,
    frequency: VigilanceArea.Frequency.ALL_MONTHS,
    id: 1,
    isArchived: false,
    isDraft: false,
    name: 'Today',
    seaFront: 'MED',
    startDatePeriod: `${customDayjs().format('YYYY-MM-DD')} 00:00:00.00000`
  }
  const quarter = {
    computedEndDate: `${customDayjs().startOf('quarter').add(3, 'weeks').format('YYYY-MM-DD')} 23:59:59.99999`,
    endDatePeriod: `${customDayjs().endOf('quarter').format('YYYY-MM-DD')} 00:00:00.00000`,
    endingCondition: VigilanceArea.EndingCondition.OCCURENCES_NUMBER,
    endingOccurrenceDate: undefined,
    endingOccurrencesNumber: 3,
    frequency: VigilanceArea.Frequency.ALL_WEEKS,
    id: 2,
    isArchived: false,
    isDraft: false,
    name: 'Quarter',
    seaFront: 'MED',
    startDatePeriod: `${customDayjs().startOf('quarter').format('YYYY-MM-DD')} 00:00:00.00000`
  }
  const outsideFilteredDate = {
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
    id: 4,
    isArchived: false,
    isDraft: false,
    name: 'OutsideFilteredDate',
    seaFront: 'MED',
    startDatePeriod: `${customDayjs().add(1, 'year').add(4, 'months').format('YYYY-MM-DD')} 00:00:00.00000`
  }
  const year = {
    computedEndDate: undefined,
    endDatePeriod: `${customDayjs().add(24, 'days').format('YYYY-MM-DD')} 23:59:59.99999`,
    endingCondition: VigilanceArea.EndingCondition.NEVER,
    endingOccurrenceDate: undefined,
    endingOccurrencesNumber: undefined,
    frequency: VigilanceArea.Frequency.ALL_YEARS,
    id: 3,
    isArchived: false,
    isDraft: false,
    name: 'Year',
    seaFront: 'MED',
    startDatePeriod: `${customDayjs().add(3, 'days').format('YYYY-MM-DD')} 00:00:00.00000`
  }

  const areas = [today, quarter, year, outsideFilteredDate]

  it('filters areas for today', () => {
    const result = getFilterVigilanceAreasPerPeriod(
      areas,
      VigilanceArea.VigilanceAreaFilterPeriod.AT_THE_MOMENT,
      undefined
    )
    expect(result).toEqual([today, quarter])
  })

  it('filters areas within current quarter', () => {
    const result = getFilterVigilanceAreasPerPeriod(
      areas,
      VigilanceArea.VigilanceAreaFilterPeriod.CURRENT_QUARTER,
      undefined
    )
    expect(result).toEqual([today, quarter, year])
  })

  it('filters areas within current year', () => {
    const result = getFilterVigilanceAreasPerPeriod(
      areas,
      VigilanceArea.VigilanceAreaFilterPeriod.CURRENT_YEAR,
      undefined
    )
    expect(result).toEqual([today, quarter, year])
  })

  it('filters areas within next three months', () => {
    const result = getFilterVigilanceAreasPerPeriod(
      areas,
      VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS,
      undefined
    )
    expect(result).toEqual([today, quarter, year])
  })
})
