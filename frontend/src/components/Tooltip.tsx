import { Icon as IconUi, type IconProps, THEME, useNewWindow } from '@mtes-mct/monitor-ui'
import { type FunctionComponent, type ReactNode, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

type TooltipType = {
  Icon?: FunctionComponent<IconProps>
  children: ReactNode
  className?: string
  color?: string
  iconSize?: number
  isSideWindow?: boolean
  linkText?: string
  orientation?: 'BOTTOM_RIGHT' | 'TOP_LEFT' | 'BOTTOM_LEFT'
}

export function Tooltip({
  children,
  className,
  color = THEME.color.slateGray,
  Icon = IconUi.Info,
  iconSize = 18,
  isSideWindow = false,
  linkText = undefined,
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
        {linkText ? (
          <LinkText
            aria-describedby={id}
            color={color}
            onBlur={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onMouseOver={() => setIsVisible(true)}
            style={{ cursor: 'pointer' }}
            tabIndex={0}
          >
            {linkText}
          </LinkText>
        ) : (
          <Icon
            aria-describedby={id}
            color={color}
            onBlur={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onMouseOver={() => setIsVisible(true)}
            size={iconSize}
            style={{ cursor: 'pointer' }}
            tabIndex={0}
          />
        )}
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

const StyledTooltip = styled.div<{
  $left: number
  $orientation: 'BOTTOM_RIGHT' | 'TOP_LEFT' | 'BOTTOM_LEFT'
  $top: number
}>`
  background: ${p => p.theme.color.cultured};
  border: ${p => p.theme.color.lightGray} 1px solid;
  box-shadow: 0 3px 6px ${p => p.theme.color.slateGray};
  font-size: 11px;
  font-weight: normal;
  padding: 4px 8px;
  position: fixed;
  ${p => {
    switch (p.$orientation) {
      case 'BOTTOM_RIGHT':
        return `transform: translate(-100%, 24px); left: calc(${p.$left}px + 24px);`
      case 'BOTTOM_LEFT':
        return `transform: translate(-100%, 24px); left: ${p.$left}px;`
      case 'TOP_LEFT':
        return `transform: translate(-100%, -100%); left: ${p.$left}px;`
      default:
        return `transform: translate(-100%, 24px); left: calc(${p.$left}px + 24px);`
    }
  }}
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
const LinkText = styled.span`
  text-decoration: underline;
  font-style: normal;
`
