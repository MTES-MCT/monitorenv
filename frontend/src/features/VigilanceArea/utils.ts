import { customDayjs } from '@mtes-mct/monitor-ui'

import { VigilanceArea } from './types'

export const endingOccurenceText = (endingCondition?: VigilanceArea.EndingCondition, computedEndDate?: string) => {
  if (!endingCondition) {
    return ''
  }

  if (endingCondition === VigilanceArea.EndingCondition.NEVER) {
    return 'pas de fin de récurrence'
  }

  if (!computedEndDate) {
    return ''
  }

  return `fin le ${customDayjs(computedEndDate).utc().format('DD/MM/YYYY')}`
}
function getUniqueDayNames(startDate: string, endDate: string): string[] {
  const days: string[] = []
  let current = customDayjs(startDate).utc()
  const end = customDayjs(endDate).utc()

  while (current.isSameOrBefore(end, 'day')) {
    const dayName = current.format('dddd')
    if (!days.includes(dayName)) {
      days.push(dayName)
    }
    current = current.add(1, 'day')
  }

  return days
}

function formatDaysList(days: string[]): string {
  if (days.length >= 7) {
    return 'Se répète tous les jours'
  }
  if (days.length === 1) {
    return `Se répète tous les ${days[0]}`
  }

  const last = days.at(-1)
  const rest = days.slice(0, -1).join(', ')

  return `Se répète tous les ${rest} et ${last}`
}

function computeWeeklyText(startDate: string | undefined, endDate: string | undefined): string {
  if (!startDate || !endDate) {
    return 'Se répète toutes les semaines'
  }

  const days = getUniqueDayNames(startDate, endDate)

  return formatDaysList(days)
}

export const frequencyText = (
  frequency: VigilanceArea.Frequency | undefined,
  startDate: string | undefined,
  endDate: string | undefined
) => {
  switch (frequency) {
    case VigilanceArea.Frequency.ALL_YEARS: {
      return 'Se répète tous les ans'
    }
    case VigilanceArea.Frequency.ALL_MONTHS: {
      return 'Se répète tous les mois'
    }
    case VigilanceArea.Frequency.ALL_WEEKS: {
      return computeWeeklyText(startDate, endDate)
    }
    case VigilanceArea.Frequency.NONE:
    default:
      return ''
  }
}

export function computeVigilanceAreaPeriod(
  period: VigilanceArea.VigilanceAreaPeriod | undefined,
  withReccurenceText = true
) {
  if (period?.isAtAllTimes) {
    return 'En tout temps'
  }

  if (period?.startDatePeriod) {
    const startText = period?.startDatePeriod
      ? `Du ${customDayjs(period?.startDatePeriod).utc().format('DD/MM/YY')}`
      : ''
    const endText = period?.endDatePeriod ? ` au ${customDayjs(period?.endDatePeriod).utc().format('DD/MM/YY')}` : ''

    const recurrenceText = withReccurenceText
      ? frequencyText(period?.frequency, period?.startDatePeriod, period?.endDatePeriod)
      : ''

    const endingText = withReccurenceText ? endingOccurenceText(period?.endingCondition, period?.computedEndDate) : ''

    return [`${startText}${endText}. ${recurrenceText}`, endingText].filter(Boolean).join(', ')
  }

  return ''
}
