import { Bold } from '@components/style'
import {
  computeOccurenceWithinCurrentYear,
  type DateRange
} from '@features/VigilanceArea/components/VigilanceAreaForm/Planning/utils'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { computeVigilanceAreaPeriod } from '@features/VigilanceArea/utils'
import { useNewWindow } from '@mtes-mct/monitor-ui'
import { useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

import { MonthBox } from './MonthBox'

export function PeriodsCell({ periods }: { periods: VigilanceArea.VigilanceAreaPeriod[] | undefined }) {
  const { newWindowContainerRef } = useNewWindow()
  const ref = useRef<HTMLDivElement>(null)
  const refRightPosition = ref.current?.getBoundingClientRect().right ?? 0
  const refTopPosition = ref.current?.getBoundingClientRect().top ?? 0
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const occurences = useMemo(
    () =>
      (periods ?? [])
        .reduce((acc: DateRange[][], period) => {
          acc.push(computeOccurenceWithinCurrentYear(period))

          return acc
        }, [])
        .flat(),
    [periods]
  )
  if (!periods || periods.length === 0) {
    return <span>-</span>
  }

  return (
    <StyledCell
      ref={ref}
      onBlur={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onMouseOver={() => setIsVisible(true)}
    >
      <PlanningWrapper>
        {[...Array(12).keys()].map(index => (
          <MonthBox key={index} dateRanges={occurences} monthIndex={index} />
        ))}
      </PlanningWrapper>
      {isVisible &&
        createPortal(
          <StyledTooltip $right={refRightPosition} $top={refTopPosition} role="tooltip">
            {periods.map(period => {
              const isCritical = period.isCritical ? 'Vigilance critique' : 'Vigilance simple'

              return (
                <VigilancePeriodWrapper key={period.id}>
                  <Bold>{isCritical}</Bold>
                  {computeVigilanceAreaPeriod(period, true)}
                </VigilancePeriodWrapper>
              )
            })}
          </StyledTooltip>,
          newWindowContainerRef.current
        )}
    </StyledCell>
  )
}

const StyledCell = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`

const PlanningWrapper = styled.ol`
  color: ${p => p.theme.color.slateGray};
  column-gap: 2px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`
const StyledTooltip = styled.div<{
  $right: number
  $top: number
}>`
  background: ${p => p.theme.color.cultured};
  border: ${p => p.theme.color.lightGray} 1px solid;
  box-shadow: 0 3px 6px ${p => p.theme.color.slateGray};
  font-size: 11px;
  font-weight: normal;
  padding: 4px 8px;
  position: fixed;
  transform: ${p => `translate(-100%, 24px); left: calc(${p.$right}px);`};
  top: ${p => p.$top}px;
  max-width: 310px;
  pointer-events: none;
  z-index: 5;
`
const VigilancePeriodWrapper = styled.p`
  display: flex;
  flex-direction: column;
`
