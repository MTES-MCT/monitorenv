import { Icon as IconUi, type IconProps, THEME, useNewWindow } from '@mtes-mct/monitor-ui'
import { type FunctionComponent, type ReactNode, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

type TooltipType = {
  Icon?: FunctionComponent<IconProps>
  children: ReactNode
  className?: string
  color?: string
  isSideWindow?: boolean
  orientation?: 'BOTTOM_RIGHT' | 'TOP_LEFT'
}

export function Tooltip({
  children,
  className,
  color = THEME.color.slateGray,
  Icon = IconUi.Info,
  isSideWindow = false,
  orientation = 'BOTTOM_RIGHT'
}: TooltipType) {
  const ref = useRef<HTMLDivElement>(null)
  const refLeftPosition = ref.current?.getBoundingClientRect().left ?? 0
  const refTopPosition = ref.current?.getBoundingClientRect().top ?? 0
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const id = useId()

  const { newWindowContainerRef } = useNewWindow()

  return (
    <>
      <Wrapper ref={ref}>
        <Icon
          aria-describedby={id}
          color={color}
          onBlur={() => setIsVisible(false)}
          onFocus={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          onMouseOver={() => setIsVisible(true)}
          style={{ cursor: 'pointer' }}
          tabIndex={0}
        />
      </Wrapper>

      {isVisible &&
        createPortal(
          <StyledTooltip
            $left={refLeftPosition}
            $orientation={orientation}
            $top={refTopPosition}
            className={className}
            id={id}
            role="tooltip"
          >
            {children}
          </StyledTooltip>,
          isSideWindow ? newWindowContainerRef.current : document.body
        )}
    </>
  )
}

const StyledTooltip = styled.div<{ $left: number; $orientation: 'BOTTOM_RIGHT' | 'TOP_LEFT'; $top: number }>`
  background: ${p => p.theme.color.cultured};
  border: ${p => p.theme.color.lightGray} 1px solid;
  box-shadow: 0 3px 6px ${p => p.theme.color.slateGray};
  font-size: 11px;
  font-weight: normal;
  padding: 4px 8px;
  position: fixed;
  ${p =>
    p.$orientation === 'TOP_LEFT'
      ? `transform: translate(-100%, -100%);left: ${p.$left}px;`
      : `left: calc(${p.$left}px + 24px);`}
  top: ${p => p.$top}px;
  max-width: 310px;
  width: 100%;
  pointer-events: none;
  z-index: 5;
`

const Wrapper = styled.div`
  > span:hover {
    color: ${p => p.theme.color.blueYonder};
  }
`
