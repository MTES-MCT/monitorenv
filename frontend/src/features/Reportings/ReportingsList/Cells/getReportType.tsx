import { Dot, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ReportingTypeEnum, ReportingTypeLabels } from '../../../../domain/entities/reporting'

export function getReportType(reportType: string) {
  const color = reportType === ReportingTypeEnum.INFRACTION_SUSPICION ? THEME.color.maximumRed : THEME.color.blueGray
  if (reportType) {
    return (
      <StyledTypeContainer>
        <Dot $backgroundColor={color} $borderColor={color} $size={10} />
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
