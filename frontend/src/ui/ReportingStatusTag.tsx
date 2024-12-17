import { Icon, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ReportingStatusEnum } from '../domain/entities/reporting'

export function ReportingStatusTag({ reportingStatus }: { reportingStatus: ReportingStatusEnum }) {
  if (reportingStatus === ReportingStatusEnum.ARCHIVED) {
    return (
      <StatusWrapper $color={THEME.color.slateGray} $smallMargin>
        <Icon.Check size={16} />
        Archivé
      </StatusWrapper>
    )
  }

  return (
    <StatusWrapper $color={THEME.color.charcoal}>
      <StyledCircle $color={THEME.color.charcoal} />
      En cours
    </StatusWrapper>
  )
}

const StatusWrapper = styled.div<{ $color: string; $smallMargin?: boolean }>`
  color: ${p => p.color};
  font-weight: 500;
  display: flex;
  align-items: center;
  svg {
    margin-right: ${p => (p.$smallMargin ? '2px' : '6px')};
    margin-left: ${p => (p.$smallMargin ? '-2px' : '0px')};
  }
`
const StyledCircle = styled.div<{ $color: string }>`
  height: 10px;
  width: 10px;
  margin-right: 6px;
  background-color: ${p => p.$color};
  border-radius: 50%;
  display: inline-block;
`
