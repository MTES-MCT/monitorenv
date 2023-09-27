import { Icon, THEME } from '@mtes-mct/monitor-ui'

import { Accented, ReportingDate, SummaryContent } from './style'
import { getFormattedReportingId } from '../../../../domain/entities/reporting'
import { getDateAsLocalizedStringCompact } from '../../../../utils/getDateAsLocalizedString'

export function ReportingCard({ action }) {
  return (
    <>
      <Icon.Report color={THEME.color.charcoal} size={20} />
      <SummaryContent>
        <Accented>{`Signalement ${getFormattedReportingId(action.reportingId)} ${action.displayedSource}`}</Accented>
        <ReportingDate>{getDateAsLocalizedStringCompact(action.createdAt)}</ReportingDate>
        <div>
          <Accented>{action.theme}</Accented> {action.theme && '-'} {action.description || 'Aucune description'}
        </div>
      </SummaryContent>
    </>
  )
}
