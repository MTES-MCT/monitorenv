import { customDayjs } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import type { DateRange } from '@features/VigilanceArea/components/VigilanceAreaForm/Planning/utils'

type MonthBoxProps = {
  dateRanges: DateRange[]
  monthIndex: number
}

export function MonthBox({ dateRanges, monthIndex }: MonthBoxProps) {
  const month = customDayjs().utc().set('month', monthIndex)
  const daysInMonth = month.daysInMonth()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const isDayInPeriod = (dayNum: number) =>
    dateRanges.some(dateRange => {
      const dayToCompare = month.set('date', dayNum)

      return (
        dateRange.start.isSame(dayToCompare, 'day') ||
        dateRange.end.isSame(dayToCompare, 'day') ||
        (dateRange.start.isBefore(dayToCompare) && dateRange.end.isAfter(dayToCompare))
      )
    })

  return (
    <Box $dayInMonth={daysInMonth}>
      {days.map(day => (
        <DayBox key={day} $isHighlighted={isDayInPeriod(day)} />
      ))}
    </Box>
  )
}

const Box = styled.div<{ $dayInMonth: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $dayInMonth }) => $dayInMonth}, 1fr);
  border: 1px solid ${p => p.theme.color.gainsboro};
  width: 52px;
  height: 26px;
`

const DayBox = styled.div<{ $isHighlighted: boolean }>`
  width: 100%;
  height: 100%;
  background-color: ${({ $isHighlighted }) => ($isHighlighted ? '#C2514180' : 'white')};
`
