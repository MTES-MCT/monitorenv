import { customDayjs } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import type { DateRange } from '@features/VigilanceArea/components/VigilanceAreaForm/Planning/utils'

type MonthBoxProps = {
  dateRanges: DateRange[]
  monthIndex: number
}

export function MonthBox({ dateRanges, monthIndex }: MonthBoxProps) {
  const month = customDayjs().utc().set('month', monthIndex)

  const daysInMonth = 30
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const isDayInPeriod = (dayNum: number) => {
    const dayToCompare = month.set('date', dayNum)

    return dateRanges.some(
      dateRange =>
        dayToCompare.isSame(dateRange.start, 'day') ||
        dayToCompare.isSame(dateRange.end, 'day') ||
        (dayToCompare.isAfter(dateRange.start) && dayToCompare.isBefore(dateRange.end))
    )
  }

  const isDayInCriticalPeriod = (dayNum: number) =>
    dateRanges.some(dateRange => dateRange.isCritical && isDayInPeriod(dayNum))

  const isStart = (dayNum: number) => {
    const dayToCompare = month.set('date', dayNum)

    return dateRanges.some(dateRange => dayToCompare.isSame(dateRange.start, 'day'))
  }

  const isEnd = (dayNum: number) => {
    const dayToCompare = month.set('date', dayNum)

    return dateRanges.some(dateRange => dayToCompare.isSame(dateRange.end, 'day'))
  }

  return (
    <Box>
      {days.map(day => {
        const isInPeriod = isDayInPeriod(day)
        const isCritical = isDayInCriticalPeriod(day)

        return (
          <DayBox
            key={day}
            $isCritical={isCritical}
            $isEnd={isEnd(day) || (isInPeriod && day === 30)}
            $isHighlighted={isInPeriod}
            $isStart={isStart(day) || (isInPeriod && day === 1)}
          />
        )
      })}
    </Box>
  )
}

const Box = styled.li`
  background-color: ${p => p.theme.color.white};

  display: grid;
  grid-template-columns: repeat(30, 1fr);
  border: 1px solid ${p => p.theme.color.gainsboro};
  width: 14px;
  height: 14px;
`

const DayBox = styled.div<{ $isCritical: boolean; $isEnd: boolean; $isHighlighted: boolean; $isStart: boolean }>`
  width: 100%;
  height: 100%;
  opacity: 1;
  ${({ $isCritical, $isHighlighted }) => $isHighlighted && `background-color: ${$isCritical ? '#E1000F' : '#C25141'};`}
`
