import { THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ReportingStatusEnum } from '../domain/entities/reporting'

export function ReportingStatusTag({
  isLabel,
  reportingStatus,
  smallMargin
}: {
  isLabel?: boolean
  reportingStatus: ReportingStatusEnum
  smallMargin?: boolean
}) {
  switch (reportingStatus) {
    case ReportingStatusEnum.ARCHIVED:
      return (
        <StatusWrapper color={THEME.color.slateGray} isLabel={isLabel} smallMargin={smallMargin}>
          <StyledCircle color={THEME.color.slateGray} />
          Archivé
        </StatusWrapper>
      )
    case ReportingStatusEnum.INFRACTION_SUSPICION:
      return (
        <StatusWrapper color={THEME.color.maximumRed} isLabel={isLabel} smallMargin={smallMargin}>
          <StyledCircle color={THEME.color.maximumRed} />
          En cours
        </StatusWrapper>
      )
    case ReportingStatusEnum.OBSERVATION:
      return (
        <StatusWrapper color={THEME.color.blueGray[100]} isLabel={isLabel} smallMargin={smallMargin}>
          <StyledCircle color={THEME.color.blueGray[100]} />
          En cours
        </StatusWrapper>
      )
    case ReportingStatusEnum.IN_PROGRESS:
    default:
      return (
        <StatusWrapper color={THEME.color.slateGray} isLabel={isLabel} smallMargin={smallMargin}>
          <StyledCircle color={THEME.color.slateGray} />
          En cours
        </StatusWrapper>
      )
  }
}

const StatusWrapper = styled.div<{ color: string; isLabel?: boolean; smallMargin?: boolean }>`
  color: ${p => p.color};
  font-weight: 500;
  display: flex;
  align-items: center;
  ${p =>
    !p.isLabel &&
    `
    background: ${p.theme.color.white};
    border-radius: 10px;
    padding-right: 8px;
    padding-left: 8px;
`}
  svg {
    margin-right: ${p => (p.smallMargin ? '2px' : '6px')};
    margin-left: ${p => (p.smallMargin ? '-2px' : '0px')};
  }
`
const StyledCircle = styled.div<{ color: string }>`
  height: 10px;
  width: 10px;
  margin-right: 6px;
  background-color: ${p => p.color};
  border-radius: 50%;
  display: inline-block;
`
