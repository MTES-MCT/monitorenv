import { Tooltip } from '@components/Tooltip'
import { StyledPeriodCircle } from '@features/VigilanceArea/components/VigilanceAreasList/Cells/PeriodsCell'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { computeVigilanceAreaPeriod, endingOccurenceText, frequencyText } from '@features/VigilanceArea/utils'
import { Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function PeriodCell({ period }: { period: VigilanceArea.VigilanceAreaPeriod | undefined }) {
  return (
    <StyledCell>
      {!period?.isCritical && <StyledPeriodCircle $isCritical={false} />}
      {period?.isCritical && <StyledPeriodCircle $isCritical />}
      {computeVigilanceAreaPeriod(period, false)}
      {period?.frequency && period.frequency !== VigilanceArea.Frequency.NONE && (
        <Tooltip Icon={Icon.Reset} isSideWindow>
          {[
            frequencyText(period?.frequency, false),
            endingOccurenceText(period?.endingCondition, period?.computedEndDate, false)
          ].join(', ')}
        </Tooltip>
      )}
    </StyledCell>
  )
}

const StyledCell = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`
