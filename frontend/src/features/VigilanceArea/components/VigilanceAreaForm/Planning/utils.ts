import { VigilanceArea } from '@features/VigilanceArea/types'
import { customDayjs } from '@mtes-mct/monitor-ui'

import type { Dayjs } from 'dayjs'

export type DateRange = {
  end: Dayjs
  start: Dayjs
}

export function computeOccurenceWithinCurrentYear(area: VigilanceArea.VigilanceArea): DateRange[] {
  const now = customDayjs().utc()
  const startOfYear = now.startOf('year').utc()
  const endOfYear = now.endOf('year').utc()

  // 1. isAtAllTimes → toute l'année
  if (area.isAtAllTimes) {
    return [
      {
        end: endOfYear,
        start: startOfYear
      }
    ]
  }

  // 2. Pas de startDatePeriod → aucune occurrence
  if (!area.startDatePeriod) {
    return []
  }

  const startDate = customDayjs(area.startDatePeriod).utc()
  const endDate = customDayjs(area.endDatePeriod).utc()

  // 3. Frequency NONE → période unique
  if (area.frequency === VigilanceArea.Frequency.NONE) {
    return [
      {
        end: endDate.isAfter(endOfYear) ? endOfYear : endDate,
        start: startDate
      }
    ]
  }

  // 4. Fonction pour générer les récurrences
  const generateRecurring = (unit: 'week' | 'month' | 'year'): DateRange[] => {
    const results: DateRange[] = []

    // Trouver la première occurrence dans l'année courante
    let shift = 0
    while (endDate.add(shift, unit).isBefore(startOfYear)) {
      shift += 1
    }

    let occStart = startDate.add(shift, unit)
    let occEnd = endDate.add(shift, unit)

    // Si la première occurrence est après la fin de l'année, retourner vide
    if (occStart.isAfter(endOfYear)) {
      return []
    }

    // Générer les occurrences tant qu'on reste dans l'année
    while (occStart.isBefore(endOfYear) || occStart.isSame(endOfYear, 'day')) {
      // Clipper les dates aux bornes de l'année courante
      const clippedStart = occStart.isBefore(startOfYear) ? startOfYear : occStart
      const clippedEnd = occEnd.isAfter(endOfYear) ? endOfYear : occEnd

      results.push({
        end: clippedEnd.clone().utc(),
        start: clippedStart.clone().utc()
      })

      occStart = occStart.add(1, unit)
      occEnd = occEnd.add(1, unit)
    }

    return results
  }

  // 5. Fréquences récurrentes
  if (area.frequency === VigilanceArea.Frequency.ALL_WEEKS) {
    return generateRecurring('week')
  }

  if (area.frequency === VigilanceArea.Frequency.ALL_MONTHS) {
    return generateRecurring('month')
  }

  if (area.frequency === VigilanceArea.Frequency.ALL_YEARS) {
    return generateRecurring('year')
  }

  return []
}
