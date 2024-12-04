import { Icon as IconUi, THEME, useNewWindow, type IconProps } from '@mtes-mct/monitor-ui'
import { useId, useRef, useState, type FunctionComponent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

type TooltipType = {
  Icon?: FunctionComponent<IconProps>
  children: ReactNode
  color?: string
  isSideWindow?: boolean
}

export function Tooltip({
  children,
  color = THEME.color.slateGray,
  Icon = IconUi.Info,
  isSideWindow = false
}: TooltipType) {
  const ref = useRef<HTMLDivElement>(null)
  const refLeftPosition = ref.current?.getBoundingClientRect().left ?? 0
  const refTopPosition = ref.current?.getBoundingClientRect().top ?? 0
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const id = useId()

  const { newWindowContainerRef } = useNewWindow()

  return (
    <>
      <div ref={ref}>
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
      </div>

      {isVisible &&
        createPortal(
          <StyledTooltip $left={refLeftPosition} $top={refTopPosition} id={id} role="tooltip">
            {children}
          </StyledTooltip>,
          isSideWindow ? newWindowContainerRef.current : (document.body as HTMLElement)
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
  max-width: 310px;
  pointer-events: none;
  z-index: 2;
`
