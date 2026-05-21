import {
  isDayInCriticalPeriod,
  isDayInPeriod,
  isEnd,
  isStart,
  type DateRange
} from '@features/VigilanceArea/components/VigilanceAreaForm/Planning/utils'
import { customDayjs, Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

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

  return (
    <>
      <Label $isBold={isCurrentMonth}>{label}</Label>
      <Wrapper>
        <Box $dayInMonth={daysInMonth}>
          {days.map(day => {
            const isInPeriod = isDayInPeriod(day, month, dateRanges)
            const isCritical = isDayInCriticalPeriod(day, month, dateRanges)

            return (
              <DayBox
                key={day}
                $isCritical={isCritical}
                $isEnd={isEnd(day, month, dateRanges) || (isInPeriod && day === daysInMonth)}
                $isHighlighted={isInPeriod}
                $isStart={isStart(day, month, dateRanges) || (isInPeriod && day === 1)}
              />
            )
          })}
          {isCurrentMonth && <BackgroundBox />}
        </Box>
        {isCurrentMonth && (
          <IconWrapper>
            <StyledIcon />
          </IconWrapper>
        )}
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
  position: relative;
`

const IconWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
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

const DayBox = styled.div<{ $isCritical: boolean; $isEnd: boolean; $isHighlighted: boolean; $isStart: boolean }>`
  width: 100%;
  height: 100%;
  ${({ $isCritical, $isHighlighted, theme }) =>
    $isHighlighted &&
    `background-color: ${$isCritical ? '#C25141BF' : '#C2514180'};
    border-top: ${$isCritical ? `2px solid ${theme.color.maximumRed}` : '1px solid #933F20'};
  border-bottom: ${$isCritical ? `2px solid ${theme.color.maximumRed}` : '1px solid #933F20'};`};
  ${p => p.$isStart && `border-left: ${p.$isCritical ? `2px solid ${p.theme.color.maximumRed}` : '1px solid #933F20'}`}
  ${p => p.$isEnd && `border-right: ${p.$isCritical ? `2px solid ${p.theme.color.maximumRed}` : '1px solid #933F20'}`}
`

const BackgroundBox = styled.div`
  background-color: ${p => p.theme.color.gunMetal};
  opacity: 0.1;
  position: absolute;
  width: 100%;
  height: 100%;
`

const StyledIcon = styled(Icon.FilledArrow)`
  margin: 0 auto;
  transform: rotate(-90deg);
`
