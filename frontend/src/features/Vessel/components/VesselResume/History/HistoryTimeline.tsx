import { YearTimeline } from '@features/Vessel/components/VesselResume/History/YearTimeline'
import { sortedActionHistory, sortedReportingHistory } from '@features/Vessel/components/VesselResume/utils'
import { customDayjs } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'

import { type EnvActionControlWithInfractions, InfractionTypeEnum } from '../../../../../domain/entities/missions'
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

  const getTotalInfraction = (year: number) => {
    const controls = envActions?.filter(envAction => customDayjs(envAction.actionStartDateTimeUtc).year() === year)

    return controls.reduce(
      (totalInfraction, control) =>
        totalInfraction + control.infractions.reduce((total, infraction) => total + infraction.nbTarget, 0),
      0
    )
  }

  const getTotalPV = (year: number) => {
    const controls = envActions?.filter(envAction => customDayjs(envAction.actionStartDateTimeUtc).year() === year)

    return controls.reduce(
      (totalInfraction, control) =>
        totalInfraction +
        control.infractions.reduce((total, infraction) => {
          if (infraction.infractionType === InfractionTypeEnum.WITH_REPORT) {
            return total + infraction.nbTarget
          }

          return total
        }, 0),
      0
    )
  }

  return (
    <>
      <header>Historique des contrôles et signalements</header>
      <ol>
        {yearsRange &&
          yearsRange.map(year => {
            const actionsPerYear = sortedActionHistory(envActions, year)
            const reportingPerYear = sortedReportingHistory(reportings, year)
            const totalInfractionPerYear = getTotalInfraction(year)
            const totalPVPerYear = getTotalPV(year)

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
