import { THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ReportingTypeEnum, reportingTypeLabels } from '../../../../domain/entities/reporting'

export function getReportType(reportType: string) {
  if (reportType) {
    return (
      <StyledTypeContainer>
        <StyledBullet
          color={
            reportType === ReportingTypeEnum.INFRACTION_SUSPICION ? THEME.color.maximumRed : THEME.color.blueGray[100]
          }
        />
        {reportingTypeLabels[reportType]?.label}
      </StyledTypeContainer>
    )
  }

  return ''
}

const StyledTypeContainer = styled.div`
  color: ${p => p.color};
  font-weight: 500;
  display: flex;
  align-items: center;
`

const StyledBullet = styled.div<{ color: string }>`
  border-radius: 50%;
  background-color: ${p => p.color};
  width: 10px;
  height: 10px;
  margin-right: 6px;
`
