import { getTotalInfraction, getTotalPV } from '@features/Mission/utils'
import { YearTimeline } from '@features/Vessel/components/VesselResume/History/YearTimeline'
import { sortedActionHistory, sortedReportingHistory } from '@features/Vessel/components/VesselResume/utils'
import { customDayjs } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'

import { type EnvActionControlWithInfractions } from '../../../../../domain/entities/missions'
import { type Reporting } from '../../../../../domain/entities/reporting'

type HistoryTimelineProps = {
  envActions: EnvActionControlWithInfractions[]
  reportings: Reporting[]
}

export function HistoryTimeline({ envActions, reportings }: HistoryTimelineProps) {
  const currentYear = customDayjs().year()

  const yearsRange = useMemo(() => {
    const years: number[] = []

    for (let year = currentYear; year >= 2023; year -= 1) {
      years.push(year)
    }

    return years
  }, [currentYear])

  return (
    <>
      <header>Historique des contrôles et signalements</header>
      <ol>
        {yearsRange &&
          yearsRange.map(year => {
            const actionsPerYear = sortedActionHistory(envActions, year)
            const reportingPerYear = sortedReportingHistory(reportings, year)
            const totalInfractionPerYear = getTotalInfraction(envActions, year)
            const totalPVPerYear = getTotalPV(envActions, year)

            return (
              <YearTimeline
                key={year}
                envActions={actionsPerYear}
                suspicionOfInfractions={reportingPerYear}
                totalInfractions={totalInfractionPerYear}
                totalPV={totalPVPerYear}
                year={year}
              />
            )
          })}
      </ol>
    </>
  )
}
