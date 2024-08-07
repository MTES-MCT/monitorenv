import { VigilanceArea } from '@features/VigilanceArea/types'
import { describe, expect, it } from '@jest/globals'
import { customDayjs } from '@mtes-mct/monitor-ui'

import { getFilterVigilanceAreasPerPeriod } from './getFilteredVigilanceAreasPerPeriod'

describe('filterVigilanceAreas', () => {
  const areas = [
    {
      computedEndDate: `${customDayjs().add(1, 'year').format('YYYY-MM-DD')} 23:59:59.99999`,
      endDatePeriod: `${customDayjs().format('YYYY-MM-DD')} 23:59:59.99999`,
      endingCondition: VigilanceArea.EndingCondition.END_DATE,
      endingOccurrenceDate: `${customDayjs().add(1, 'year').format('YYYY-MM-DD')} 23:59:59.00000`,
      endingOccurrencesNumber: undefined,
      frequency: VigilanceArea.Frequency.ALL_MONTHS,
      id: 1,
      startDatePeriod: `${customDayjs().format('YYYY-MM-DD')} 00:00:00.00000`
    },
    {
      computedEndDate: `${customDayjs().add(18, 'days').format('YYYY-MM-DD')} 23:59:59.99999`,
      endDatePeriod: `${customDayjs().add(4, 'days').format('YYYY-MM-DD')} 00:00:00.00000`,
      endingCondition: VigilanceArea.EndingCondition.OCCURENCES_NUMBER,
      endingOccurrenceDate: undefined,
      endingOccurrencesNumber: 3,
      frequency: VigilanceArea.Frequency.ALL_WEEKS,
      id: 2,
      startDatePeriod: `${customDayjs().subtract(3, 'days').format('YYYY-MM-DD')} 00:00:00.00000`
    },
    {
      computedEndDate: undefined,
      endDatePeriod: `${customDayjs().add(24, 'days').format('YYYY-MM-DD')} 23:59:59.99999`,
      endingCondition: VigilanceArea.EndingCondition.NEVER,
      endingOccurrenceDate: undefined,
      endingOccurrencesNumber: undefined,
      frequency: VigilanceArea.Frequency.ALL_YEARS,
      id: 3,
      startDatePeriod: `${customDayjs().add(3, 'days').format('YYYY-MM-DD')} 00:00:00.00000`
    },
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
      id: 4,
      startDatePeriod: `${customDayjs().add(1, 'year').add(4, 'months').format('YYYY-MM-DD')} 00:00:00.00000`
    }
  ]

  it('filters areas for today', () => {
    const result = getFilterVigilanceAreasPerPeriod(
      areas,
      VigilanceArea.VigilanceAreaFilterPeriod.AT_THE_MOMENT,
      undefined
    )
    expect(result).toEqual([areas[0], areas[1]])
  })

  it('filters areas for current quarter', () => {
    const result = getFilterVigilanceAreasPerPeriod(
      areas,
      VigilanceArea.VigilanceAreaFilterPeriod.CURRENT_QUARTER,
      undefined
    )
    expect(result).toEqual([areas[0], areas[1], areas[2]])
  })

  it('filters areas for current year', () => {
    const result = getFilterVigilanceAreasPerPeriod(
      areas,
      VigilanceArea.VigilanceAreaFilterPeriod.CURRENT_YEAR,
      undefined
    )
    expect(result).toEqual([areas[0], areas[1], areas[2]])
  })

  it('filters areas for next three months', () => {
    const result = getFilterVigilanceAreasPerPeriod(
      areas,
      VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS,
      undefined
    )
    expect(result).toEqual([areas[0], areas[1], areas[2]])
  })
})
