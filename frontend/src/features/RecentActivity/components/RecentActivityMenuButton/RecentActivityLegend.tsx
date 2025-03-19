import { recentActivityActions } from '@features/RecentActivity/slice'
import { RecentActivity } from '@features/RecentActivity/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

const LEGEND_COLORS = [
  {
    color: RecentActivity.CONTROLS_COLORS[0],
    label: '0-5%'
  },
  {
    color: RecentActivity.CONTROLS_COLORS[1],
    label: '6-10%'
  },
  {
    color: RecentActivity.CONTROLS_COLORS[2],
    label: '11-25%'
  },
  {
    color: RecentActivity.CONTROLS_COLORS[3],
    label: '26-50%'
  },
  {
    color: RecentActivity.CONTROLS_COLORS[4],
    label: '51-75%'
  },
  {
    color: RecentActivity.CONTROLS_COLORS[5],
    label: '76-90%'
  },
  {
    color: RecentActivity.CONTROLS_COLORS[6],
    label: '91-100%'
  }
]
export function RecentActivityLegend() {
  const dispatch = useAppDispatch()
  const isLegendOpen = useAppSelector(state => state.recentActivity.isLegendOpen)
  const { minControls, totalControls } = useAppSelector(state => state.recentActivity.totalControlsInAllActions)

  return (
    <LegendContainer $isOpen={isLegendOpen}>
      {isLegendOpen ? (
        <>
          <Header>
            <CloseButton Icon={Icon.Minus} onClick={() => dispatch(recentActivityActions.setIsLegenOpen(false))} />
            <Title>Légende</Title>
          </Header>
          <Body>
            <SubTitle>Nombre de contrôles</SubTitle>
            <TotalControlsLegend>
              <CircleNumbers>
                <TotalControlLabel>{totalControls}</TotalControlLabel>
                <DottedLine />
                <TotalControlLabel>{Math.round(totalControls / 2)}</TotalControlLabel>
                <DottedLine />
                <TotalControlLabel>{minControls}</TotalControlLabel>
                <DottedLine />
              </CircleNumbers>

              <CircleContainer>
                <Circle />
                <Circle />
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
      ) : (
        <StyledIconButton
          Icon={Icon.ListLines}
          onClick={() => dispatch(recentActivityActions.setIsLegenOpen(true))}
          size={Size.LARGE}
        />
      )}
    </LegendContainer>
  )
}

const LegendContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  right: ${p => (p.$isOpen ? '325px' : '201px')};
  width: 164px;
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
`
const CloseButton = styled(IconButton)`
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
  height: 76px;
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
  right: 30px;
`

const DottedLine = styled.div`
  position: absolute;
  width: 94px;
  right: 4px;
  border-bottom: 1px dashed ${p => p.theme.color.gainsboro};

  &:nth-child(2) {
    top: 7px;
  }
  &:nth-child(4) {
    top: 32px;
  }
  &:nth-child(6) {
    top: 58px;
  }
`
const TotalControlLabel = styled.span`
  position: absolute;
  &:nth-child(3) {
    top: 26px;
  }
  &:nth-child(5) {
    top: 50px;
  }
`

const CircleContainer = styled.div`
  position: absolute;
  left: 10px;
  top: 83px;
`
const Circle = styled.div`
  border: 1px solid ${p => p.theme.color.slateGray};
  border-radius: 50%;
  position: absolute;
  &:nth-child(1) {
    width: 52px;
    height: 52px;
  }
  &:nth-child(2) {
    width: 28px;
    height: 28px;
    top: 24px;
    left: 12px;
  }
  &:nth-child(3) {
    width: 7px;
    height: 7px;
    top: 44px;
    left: 22px;
  }
`
