import { customDayjs, Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import type { DateRange } from '@features/VigilanceArea/components/VigilanceAreaForm/Planning/utils'

type MonthBoxProps = {
  dateRanges: DateRange[]
  label: string
  monthIndex: number
}

export function MonthBox({ dateRanges, label, monthIndex }: MonthBoxProps) {
  const isCurrentMonth = customDayjs().utc().month() === monthIndex
  const month = customDayjs().utc().set('month', monthIndex)

  const daysInMonth = month.daysInMonth()
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

  const isStart = (dayNum: number) => {
    const dayToCompare = month.set('date', dayNum)

    return dateRanges.some(dateRange => dayToCompare.isSame(dateRange.start, 'day'))
  }

  const isEnd = (dayNum: number) => {
    const dayToCompare = month.set('date', dayNum)

    return dateRanges.some(dateRange => dayToCompare.isSame(dateRange.end, 'day'))
  }

  return (
    <>
      <Label $isBold={isCurrentMonth}>{label}</Label>
      <Wrapper>
        <Box $dayInMonth={daysInMonth}>
          {days.map(day => (
            <DayBox
              key={day}
              $isEnd={isEnd(day) || (isDayInPeriod(day) && day === daysInMonth)}
              $isHighlighted={isDayInPeriod(day)}
              $isStart={isStart(day) || (isDayInPeriod(day) && day === 1)}
            />
          ))}
          {isCurrentMonth && (
            <>
              <BackgroundBox />
            </>
          )}
        </Box>
        {isCurrentMonth && <StyledIcon />}
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
  position: relative;
`

const Label = styled.span<{ $isBold: boolean }>`
  ${p => p.$isBold && `font-weight: 700; color:${p.theme.color.charcoal}`}
`

const Box = styled.div<{ $dayInMonth: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $dayInMonth }) => $dayInMonth}, 1fr);
  border: 1px solid ${p => p.theme.color.gainsboro};
  width: 52px;
  height: 26px;
  position: relative;
  margin-top: 4px;
`

const DayBox = styled.div<{ $isEnd: boolean; $isHighlighted: boolean; $isStart: boolean }>`
  width: 100%;
  height: 100%;
  ${({ $isHighlighted }) =>
    $isHighlighted &&
    `background-color: #C2514180;
    border-top: 1px solid #E1000F;
  border-bottom: 1px solid #e1000f;`};
  background-color: ${({ $isHighlighted }) => ($isHighlighted ? '#C2514180' : `white`)};
  ${p => p.$isStart && 'border-left: 1px solid #E1000F;'}
  ${p => p.$isEnd && 'border-right: 1px solid #E1000F;'}
`

const BackgroundBox = styled.div`
  background-color: ${p => p.theme.color.gunMetal};
  opacity: 0.1;
  position: absolute;
  width: 100%;
  height: 100%;
`

const StyledIcon = styled(Icon.FilledArrow)`
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%) rotate(-90deg);
`
