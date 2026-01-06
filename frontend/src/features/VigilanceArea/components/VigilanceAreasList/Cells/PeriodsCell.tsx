import { Tooltip } from '@components/Tooltip'
import { BasePeriodCircle } from '@features/VigilanceArea/components/VigilanceAreaForm/Periods'
import { PeriodCell } from '@features/VigilanceArea/components/VigilanceAreasList/Cells/PeriodCell'
import { VigilanceArea } from '@features/VigilanceArea/types'
import styled from 'styled-components'

export function PeriodsCell({ periods }: { periods: VigilanceArea.VigilanceAreaPeriod[] | undefined }) {
  if (!periods || periods.length === 0) {
    return <span>-</span>
  }
  const hasSimplePeriod = periods.some(period => !period.isCritical)
  const hasCriticalPeriod = periods.some(period => period.isCritical)

  return (
    <StyledCell>
      {periods.length > 1 && (
        <StyledCell>
          <div>
            {hasSimplePeriod && <StyledPeriodCircle $isCritical={false} />}
            {hasCriticalPeriod && <StyledPeriodCircle $isCritical />}
          </div>
          Périodes multiples{' '}
          <StyledTooltip isSideWindow>
            {periods.map(period => (
              <PeriodCell period={period} />
            ))}
          </StyledTooltip>
        </StyledCell>
      )}
      {periods.length === 1 && <PeriodCell period={periods[0]} />}
    </StyledCell>
  )
}

const StyledCell = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const StyledPeriodCircle = styled(BasePeriodCircle)`
  margin-right: 4px;
`

const StyledTooltip = styled(Tooltip)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
`
