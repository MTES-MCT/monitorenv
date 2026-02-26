import { getFormattedReportingId } from '@features/Reportings/utils'
import { Vessel } from '@features/Vessel/types'
import { customDayjs, type DateAsStringRange } from '@mtes-mct/monitor-ui'

import { type Reporting, ReportingTypeEnum } from '../../../../domain/entities/reporting'

import type { EnvActionControlWithInfractions } from '../../../../domain/entities/missions'
import type { EventProps } from '@features/Vessel/components/VesselResume/History/YearTimeline'

export const UNKNOWN = '-'

export const sortedActionHistory = (envActions: EnvActionControlWithInfractions[], year: number) =>
  envActions
    .filter(envAction => customDayjs(envAction.actionStartDateTimeUtc).year() === year)
    .map<EventProps>(envAction => {
      const title = envAction.themes && envAction.themes.length > 0 ? envAction.themes[0] : 'à renseigner'
      const source = envAction.controlUnits.join(', ')

      return {
        date: envAction.actionStartDateTimeUtc,
        isInfraction: true,
        parentId: envAction.missionId,
        source,
        title,
        type: 'CONTROL'
      }
    })

export const sortedReportingHistory = (reportings: Reporting[], year: number) =>
  reportings
    .filter(reporting => customDayjs(reporting.createdAt).year() === year)
    .map<EventProps>(reporting => toEvent(reporting))

export function toEvent(reporting: Reporting): EventProps {
  const title = `Signalement ${getFormattedReportingId(reporting.reportingId)}`
  const source = reporting.reportingSources.map(reportingSource => reportingSource.displayedSource).join(', ')

  return {
    date: reporting.createdAt,
    isInfraction: reporting.reportType === ReportingTypeEnum.INFRACTION_SUSPICION,
    parentId: reporting.id,
    source,
    title,
    type: 'REPORTING'
  }
}

export function getDatesFromFilters(
  periodFilter: Vessel.AisTrackSettingsEnum | undefined,
  specificDateRange: DateAsStringRange | undefined
) {
  let from = specificDateRange ? customDayjs(specificDateRange[0]) : customDayjs().utc().startOf('day')
  let to = specificDateRange ? customDayjs(specificDateRange[1]) : customDayjs().utc().endOf('day')
  switch (periodFilter) {
    case Vessel.AisTrackSettingsEnum.TWELVE_HOURS:
      from = customDayjs().utc().subtract(12, 'hours').startOf('day')
      to = customDayjs().utc().endOf('day')
      break
    case Vessel.AisTrackSettingsEnum.TWENTY_FOUR_HOURS:
      from = customDayjs().utc().subtract(24, 'hours').startOf('day')
      to = customDayjs().utc().endOf('day')
      break
    case Vessel.AisTrackSettingsEnum.THREE_DAYS:
      from = customDayjs().utc().subtract(3, 'days').startOf('day')
      to = customDayjs().utc().endOf('day')
      break
    default:
      break
  }

  return { from: from.toISOString(), to: to.toISOString() }
}
