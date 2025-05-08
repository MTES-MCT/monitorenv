import { CONTROLS_COLORS, MAX_CONTROLS, MIN_CONTROLS } from '@features/RecentActivity/constants'
import { recentActivityActions } from '@features/RecentActivity/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import styled, { css } from 'styled-components'

import { calculateDotSize } from '../utils'

export type LegendLocation = 'OUTSIDE' | 'INSIDE'

export const LEGEND_COLORS = [
  {
    color: CONTROLS_COLORS[0],
    label: '0-5%'
  },
  {
    color: CONTROLS_COLORS[1],
    label: '6-10%'
  },
  {
    color: CONTROLS_COLORS[2],
    label: '11-25%'
  },
  {
    color: CONTROLS_COLORS[3],
    label: '26-50%'
  },
  {
    color: CONTROLS_COLORS[4],
    label: '51-75%'
  },
  {
    color: CONTROLS_COLORS[5],
    label: '76-90%'
  },
  {
    color: CONTROLS_COLORS[6],
    label: '91-100%'
  }
]

export const MEDIUM_DOT_SIZE = 50
export function RecentActivityLegend({ location }: { location: LegendLocation }) {
  const dispatch = useAppDispatch()
  const isLegendOpen = useAppSelector(state => state.recentActivity.isLegendOpen)

  const mediumDotSize = calculateDotSize(MEDIUM_DOT_SIZE)

  return (
    <LegendContainer $isOpen={isLegendOpen} $location={location}>
      {isLegendOpen && (
        <>
          <Header>
            <ReduceButton Icon={Icon.Minus} onClick={() => dispatch(recentActivityActions.setIsLegenOpen(false))} />
            <Title>Légende</Title>
          </Header>
          <Body>
            <SubTitle>Nombre de contrôles</SubTitle>
            <TotalControlsLegend>
              <CircleNumbers>
                <TotalControlLabel>{MAX_CONTROLS}</TotalControlLabel>
                <DottedLine />
                <TotalControlLabel>{MEDIUM_DOT_SIZE}</TotalControlLabel>
                <DottedLine />
                <TotalControlLabel>{MIN_CONTROLS}</TotalControlLabel>
                <DottedLine />
              </CircleNumbers>

              <CircleContainer>
                <Circle />
                <Circle $size={mediumDotSize} />
                <Circle />
              </CircleContainer>
            </TotalControlsLegend>

            <SubTitle>Proportion d&apos;infraction</SubTitle>
            <ColorsLegend>
              {LEGEND_COLORS.map(({ color, label }) => (
                <ColorLegendContainer key={label}>
                  <ColorSquare $color={color} />
                  <ColorLabel>{label}</ColorLabel>
                </ColorLegendContainer>
              ))}
            </ColorsLegend>
          </Body>
        </>
      )}
      {!isLegendOpen && location === 'INSIDE' && (
        <StyledIconButton
          Icon={Icon.ListLines}
          onClick={() => dispatch(recentActivityActions.setIsLegenOpen(true))}
          size={Size.LARGE}
        />
      )}
      {!isLegendOpen && location === 'OUTSIDE' && (
        <Header>
          <ReduceButton Icon={Icon.Plus} onClick={() => dispatch(recentActivityActions.setIsLegenOpen(true))} />
          <Title>Légende</Title>
        </Header>
      )}
    </LegendContainer>
  )
}

const LegendContainer = styled.div<{ $isOpen: boolean; $location: LegendLocation }>`
  position: fixed;
  right: 380px;
  width: ${p => (p.$isOpen ? '164px;' : 'auto')};
  z-index: 1;
  ${p =>
    p.$location === 'OUTSIDE' &&
    css`
      bottom: 9px;
      right: 10px;
    `}
`
const StyledIconButton = styled(IconButton)`
  padding: 6px;
`

const Header = styled.div`
  align-items: center;
  background-color: ${p => p.theme.color.charcoal};
  display: flex;
  height: 40px;
  justify-content: space-between;
  padding: 8px 10px 8px 3px;
  width: 164px;
`

const ReduceButton = styled(IconButton)`
  color: ${p => p.theme.color.white};

  &:hover,
  &._hover {
    color: ${p => p.theme.color.white};
  }

  &:active,
  &._active {
    color: ${p => p.theme.color.white};
  }

  &:disabled,
  &._disabled {
    color: ${p => p.theme.color.white};
  }
`
const Title = styled.h2`
  color: ${p => p.theme.color.white};
  font-size: 16px;
  line-height: 22px;
  font-weight: normal;
`
const Body = styled.div`
  background-color: ${p => p.theme.color.white};
  height: 276px;
  padding: 16px;
`
const SubTitle = styled.h3`
  color: ${p => p.theme.color.slateGray};
  font-size: 11px;
  font-weight: normal;
  line-height: normal;
  margin-bottom: 4px;
`

const TotalControlsLegend = styled.div`
  height: 57px;
`
const ColorsLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`
const ColorLegendContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
`
const ColorSquare = styled.div<{ $color: string | undefined }>`
  background-color: ${p => p.$color ?? p.theme.color.white};
  height: 16px;
  width: 16px;
`
const ColorLabel = styled.span`
  font-size: 9.5px;
`
const CircleNumbers = styled.div`
  color: ${p => p.theme.color.gunMetal};
  display: flex;
  flex-direction: column;
  font-size: 9.5px;
  position: absolute;
  right: 34px;
`

const DottedLine = styled.div`
  border-bottom: 1px dashed ${p => p.theme.color.gainsboro};
  position: absolute;

  &:nth-child(2) {
    right: 4px;
    top: 9px;
    width: 100px;
  }
  &:nth-child(4) {
    right: 0px;
    top: 19px;
    width: 105px;
  }
  &:nth-child(6) {
    right: -9px;
    top: 30px;
    width: 108px;
  }
`
const TotalControlLabel = styled.span`
  position: absolute;
  &:nth-child(3) {
    left: 5px;
    top: 10px;
  }
  &:nth-child(5) {
    left: 12px;
    top: 20px;
  }
`

const CircleContainer = styled.div`
  left: 10px;
  position: absolute;
  top: 83px;
`
const Circle = styled.div<{ $size?: number }>`
  border: 2px solid ${p => p.theme.color.slateGray};
  border-radius: 50%;
  position: absolute;

  &:nth-child(1) {
    left: 6px;
    height: 30px;
    width: 30px;
  }
  &:nth-child(2) {
    height: ${p => p.$size ?? 19}px;
    left: 11px;
    top: 10px;
    width: ${p => p.$size ?? 19}px;
  }
  &:nth-child(3) {
    height: 8px;
    left: 17px;
    top: 22px;
    width: 8px;
  }
`
