import { Icon, THEME } from '@mtes-mct/monitor-ui'
import { useId, useRef, useState, type ReactNode } from 'react'
import styled from 'styled-components'

type TooltipType = {
  children: ReactNode
  color?: string
}

export function Tooltip({ children, color = THEME.color.slateGray }: TooltipType) {
  const ref = useRef<HTMLDivElement>(null)
  const refLeftPosition = ref.current?.getBoundingClientRect().left ?? 0
  const refTopPosition = ref.current?.getBoundingClientRect().top ?? 0
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const id = useId()

  return (
    <>
      <div ref={ref}>
        <StyledIcon
          aria-describedby={id}
          color={color}
          onBlur={() => setIsVisible(false)}
          onFocus={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          onMouseOver={() => setIsVisible(true)}
          tabIndex={0}
        />
      </div>
      {isVisible && (
        <StyledTooltip $left={refLeftPosition} $top={refTopPosition} id={id} role="tooltip">
          {children}
        </StyledTooltip>
      )}
    </>
  )
}

const StyledTooltip = styled.p<{ $left: number; $top: number }>`
  background: ${p => p.theme.color.cultured};
  border: ${p => p.theme.color.lightGray} 1px solid;
  box-shadow: 0px 3px 6px ${p => p.theme.color.slateGray};
  font-size: 11px;
  font-weight: normal;
  padding: 4px 8px;
  position: fixed;
  left: calc(${p => p.$left}px + 24px);
  top: ${p => p.$top}px;
  width: 310px;
  pointer-events: none;
  z-index: 2;
`

const StyledIcon = styled(Icon.Info)`
  cursor: pointer;
`
