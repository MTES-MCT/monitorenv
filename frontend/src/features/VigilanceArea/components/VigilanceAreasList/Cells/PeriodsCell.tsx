import {
  computeOccurenceWithinCurrentYear,
  type DateRange
} from '@features/VigilanceArea/components/VigilanceAreaForm/Planning/utils'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useMemo } from 'react'
import styled from 'styled-components'

import { MonthBox } from './MonthBox'

export function PeriodsCell({ periods }: { periods: VigilanceArea.VigilanceAreaPeriod[] | undefined }) {
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
    <StyledCell>
      <PlanningWrapper>
        {[...Array(12).keys()].map(index => (
          <MonthBox key={index} dateRanges={occurences} monthIndex={index} />
        ))}
      </PlanningWrapper>
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
