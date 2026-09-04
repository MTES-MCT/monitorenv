import { customDayjs } from '@mtes-mct/monitor-ui'

import { VigilanceArea } from './types'

export const endingOccurenceText = (
  endingCondition?: VigilanceArea.EndingCondition,
  computedEndDate?: string,
  capitalize = true
) => {
  if (!endingCondition) {
    return ''
  }

  if (endingCondition === VigilanceArea.EndingCondition.NEVER) {
    const text = 'pas de fin de récurrence'

    return capitalize ? capitalizeFirstLetter(text) : text
  }

  if (!computedEndDate) {
    return ''
  }

  const text = `fin le ${customDayjs(computedEndDate).utc().format('DD/MM/YYYY')}`

  return capitalize ? capitalizeFirstLetter(text) : text
}

export const frequencyText = (
  frequency: VigilanceArea.Frequency | undefined,
  startDate: string | undefined,
  endDate: string | undefined,
  capitalize = true
) => {
  switch (frequency) {
    case VigilanceArea.Frequency.ALL_YEARS: {
      const text = 'se répète tous les ans'

      return capitalize ? capitalizeFirstLetter(text) : text
    }
    case VigilanceArea.Frequency.ALL_MONTHS: {
      const text = 'se répète tous les mois'

      return capitalize ? capitalizeFirstLetter(text) : text
    }
    case VigilanceArea.Frequency.ALL_WEEKS: {
      let text = 'Se répète toutes les semaines'
      if (startDate && endDate) {
        const startDay = capitalizeFirstLetter(customDayjs(startDate).format('dddd'))
        const endDay = capitalizeFirstLetter(customDayjs(endDate).format('dddd'))
        text = `Se répète tous les ${startDay} et ${endDay}`
      }

      return capitalize ? capitalizeFirstLetter(text) : text
    }
    case VigilanceArea.Frequency.NONE:
    default:
      return ''
  }
}

const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export function computeVigilanceAreaPeriod(
  period: VigilanceArea.VigilanceAreaPeriod | undefined,
  withReccurenceText = true
) {
  if (period?.isAtAllTimes) {
    return 'En tout temps'
  }
  if (period?.startDatePeriod) {
    return `${[
      `${period?.startDatePeriod ? `Du ${customDayjs(period?.startDatePeriod).utc().format('DD/MM/YY')}` : ''}
      ${period?.endDatePeriod ? `au ${customDayjs(period?.endDatePeriod).utc().format('DD/MM/YY')}` : ''}`,
      withReccurenceText ? frequencyText(period?.frequency, period?.startDatePeriod, period?.endDatePeriod, false) : '',
      withReccurenceText ? endingOccurenceText(period?.endingCondition, period?.computedEndDate, false) : ''
    ]
      .filter(Boolean)
      .join(', ')}`
  }

  return ''
}
