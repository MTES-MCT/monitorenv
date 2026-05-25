import {
  isDayInCriticalPeriod,
  isDayInPeriod,
  type DateRange
} from '@features/VigilanceArea/components/VigilanceAreaForm/Planning/utils'
import { customDayjs } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

type MonthBoxProps = {
  dateRanges: DateRange[]
  monthIndex: number
}

export function MonthBox({ dateRanges, monthIndex }: MonthBoxProps) {
  const month = customDayjs().utc().set('month', monthIndex)

  const daysInMonth = month.daysInMonth()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <Box $daysInMonth={daysInMonth}>
      {days.map(day => {
        const isInPeriod = isDayInPeriod(day, month, dateRanges)
        const isCritical = isDayInCriticalPeriod(day, month, dateRanges)

        return <DayBox key={day} $isCritical={isCritical} $isHighlighted={isInPeriod} />
      })}
    </Box>
  )
}

const Box = styled.li<{ $daysInMonth: number }>`
  background-color: ${p => p.theme.color.white};
  display: grid;
  grid-template-columns: repeat(${p => p.$daysInMonth}, 1fr);
  border: 1px solid ${p => p.theme.color.gainsboro};
  width: 14px;
  height: 14px;
`

const DayBox = styled.div<{ $isCritical: boolean; $isHighlighted: boolean }>`
  width: 100%;
  height: 100%;
  opacity: 1;
  ${({ $isCritical, $isHighlighted }) => $isHighlighted && `background-color: ${$isCritical ? '#DC3D49' : '#D7A49D'};`}
`
