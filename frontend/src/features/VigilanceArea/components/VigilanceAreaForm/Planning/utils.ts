import { VigilanceArea } from '@features/VigilanceArea/types'
import { customDayjs } from '@mtes-mct/monitor-ui'

import type { Dayjs } from 'dayjs'

export type DateRange = {
  end: Dayjs
  start: Dayjs
}

export function computeOccurenceWithinCurrentYear(area: VigilanceArea.VigilanceArea): DateRange[] {
  const now = customDayjs().utc()
  const startOfYear = now.startOf('year')
  const endOfYear = now.endOf('year')

  // Cas 1: Toute l'année
  if (area.isAtAllTimes) {
    return [{ end: endOfYear, start: startOfYear }]
  }

  // Cas 2: Pas de date de début
  if (!area.startDatePeriod) {
    return []
  }

  const startDate = customDayjs(area.startDatePeriod).utc()
  const endDate = customDayjs(area.endDatePeriod).utc()

  // Cas 3: Pas de récurrence
  if (area.frequency === VigilanceArea.Frequency.NONE) {
    // Vérifier si la période intersecte avec l'année courante
    if (endDate.isBefore(startOfYear) || startDate.isAfter(endOfYear)) {
      return []
    }

    return [{ end: endDate.utc(), start: startDate.utc() }]
  }

  // Cas 4: Récurrences (week/month/year)
  const generateRecurring = (unit: 'week' | 'month' | 'year'): DateRange[] => {
    const results: DateRange[] = []

    // Limites
    const maxOccurrences =
      area.endingCondition === VigilanceArea.EndingCondition.OCCURENCES_NUMBER && area.endingOccurrencesNumber
        ? area.endingOccurrencesNumber
        : Infinity

    const endingDate =
      area.endingCondition === VigilanceArea.EndingCondition.END_DATE && area.endingOccurrenceDate
        ? customDayjs(area.endingOccurrenceDate).utc()
        : null

    // Trouver la première occurrence dans l'année
    let shift = 0
    while (endDate.add(shift, unit).isBefore(startOfYear)) {
      shift += 1
    }

    // Vérifier les limites avant de commencer
    if (shift >= maxOccurrences) {
      return []
    }

    let occStart = startDate.add(shift, unit)
    let occEnd = endDate.add(shift, unit)

    if (occStart.isAfter(endOfYear) || (endingDate && occStart.isAfter(endingDate))) {
      return []
    }

    // Générer les occurrences
    let count = shift
    while (occStart.isBefore(endOfYear) || occStart.isSame(endOfYear, 'day')) {
      if (count >= maxOccurrences || (endingDate && occStart.isAfter(endingDate))) {
        break
      }

      const clippedStart = occStart.isBefore(startOfYear) ? startOfYear : occStart
      const clippedEnd = occEnd.isAfter(endOfYear) ? endOfYear : occEnd

      if (clippedEnd.isAfter(startOfYear) || clippedEnd.isSame(startOfYear)) {
        results.push({ end: clippedEnd.clone().utc(), start: clippedStart.clone().utc() })
      }

      if (unit === 'year') {
        break
      }

      occStart = occStart.add(1, unit)
      occEnd = occEnd.add(1, unit)
      count += 1
    }

    return results
  }

  if (area.frequency === VigilanceArea.Frequency.ALL_WEEKS) {
    return generateRecurring('week')
  }
  if (area.frequency === VigilanceArea.Frequency.ALL_MONTHS) {
    return generateRecurring('month')
  }
  if (area.frequency === VigilanceArea.Frequency.ALL_YEARS) {
    return generateRecurring('year')
  }

  return [
    {
      end: endDate.isAfter(endOfYear) ? endOfYear : endDate,
      start: startDate
    }
  ]
}
