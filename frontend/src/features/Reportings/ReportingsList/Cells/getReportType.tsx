import { Icon, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ReportingTypeEnum, ReportingTypeLabels } from '../../../../domain/entities/reporting'

export function getReportType(reportType: string) {
  if (reportType) {
    return (
      <StyledTypeContainer>
        <Icon.DotFilled
          color={reportType === ReportingTypeEnum.INFRACTION_SUSPICION ? THEME.color.maximumRed : THEME.color.blueGray}
          size={12}
        />
        {ReportingTypeLabels[reportType]}
      </StyledTypeContainer>
    )
  }

  return ''
}

const StyledTypeContainer = styled.div`
  align-items: baseline;
  color: ${p => p.color};
  display: flex;
  font-weight: 500;
  gap: 4px;
`
