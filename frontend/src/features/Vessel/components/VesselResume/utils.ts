import { getFormattedReportingId } from '@features/Reportings/utils'
import { customDayjs } from '@mtes-mct/monitor-ui'

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
