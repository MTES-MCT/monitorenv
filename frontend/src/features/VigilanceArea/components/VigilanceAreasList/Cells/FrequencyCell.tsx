import { VigilanceArea } from '@features/VigilanceArea/types'
import { computeVigilanceAreaPeriod } from '@features/VigilanceArea/utils'
import styled from 'styled-components'

import { StyledPeriodCircle } from './PeriodsCell'

export function FrequencyCell({ periods }: { periods: VigilanceArea.VigilanceAreaPeriod[] | undefined }) {
  if (!periods || periods.length === 0) {
    return <span>-</span>
  }

  const simpleVigilanceAreaPeriods = periods.filter(period => !period.isCritical)
  const criticalVigilanceAreaPeriods = periods.filter(period => period.isCritical)

  return (
    <Wrapper>
      {simpleVigilanceAreaPeriods.length > 0 && (
        <div>
          <StyledPeriodCircle $isCritical={false} />
          <Title>Vigilance simple</Title>
          <PeriodWrapper>
            {simpleVigilanceAreaPeriods.map(period => (
              <span key={period.id}>{computeVigilanceAreaPeriod(period, false)}</span>
            ))}
          </PeriodWrapper>
        </div>
      )}
      {criticalVigilanceAreaPeriods.length > 0 && (
        <div>
          <StyledPeriodCircle $isCritical />
          <Title>Vigilance critique</Title>
          <PeriodWrapper>
            {criticalVigilanceAreaPeriods.map(period => (
              <span key={period.id}>{computeVigilanceAreaPeriod(period, true)}</span>
            ))}
          </PeriodWrapper>
        </div>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
const PeriodWrapper = styled.span`
  display: flex;
  flex-direction: column;
  gap: 4px;
`
const Title = styled.span`
  color: ${p => p.theme.color.slateGray};
`
