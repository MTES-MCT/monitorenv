import { Accent, type IconProps, Size } from '@mtes-mct/monitor-ui'
import classnames from 'classnames'
import { useMemo, type FunctionComponent } from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'
import styled from 'styled-components'

const ICON_SIZE: Record<Size, number> = {
  [Size.LARGE]: 20,
  [Size.NORMAL]: 20,
  [Size.SMALL]: 12
}

export type NavButtonProps = Omit<NavLinkProps, 'children' | 'className'> & {
  Icon?: FunctionComponent<IconProps> | undefined
  accent?: Accent | undefined
  children?: string | undefined
  className?: string | undefined
  isFullWidth?: boolean | undefined
  size?: Size | undefined
}
export function NavButton({
  accent = Accent.PRIMARY,
  children,
  className,
  Icon,
  isFullWidth = false,
  size = Size.NORMAL,
  ...originalProps
}: NavButtonProps) {
  const commonChildren = useMemo(
    () => (
      <>
        {Icon && <Icon size={ICON_SIZE[size]} />}
        {children && <ButtonLabel>{children}</ButtonLabel>}
      </>
    ),
    [children, Icon, size]
  )

  const commonProps = useMemo(
    () => ({
      $isFullWidth: isFullWidth,
      as: StyledButton,
      children: commonChildren,
      className: classnames('Element-NavButton', className),
      size,
      ...originalProps
    }),
    [className, commonChildren, isFullWidth, originalProps, size]
  )

  switch (accent) {
    case Accent.SECONDARY:
      return <SecondaryButton {...commonProps} />

    case Accent.TERTIARY:
      return <TertiaryButton {...commonProps} />

    default:
      return <PrimaryButton {...commonProps} />
  }
}

const FONT_SIZE: Record<Size, string> = {
  [Size.LARGE]: '13px',
  [Size.NORMAL]: '13px',
  [Size.SMALL]: '11px'
}
const PADDING: Record<Size, string> = {
  [Size.LARGE]: '6px 12px',
  [Size.NORMAL]: '6px 12px',
  [Size.SMALL]: '5px 8px 4px'
}
const StyledButton = styled(NavLink)<{
  $isFullWidth: boolean
  size: Size
}>`
  align-items: center;
  display: inline-flex;
  font-size: ${p => FONT_SIZE[p.size]};
  justify-content: center;
  max-width: 100%;
  padding: ${p => PADDING[p.size]};
  text-decoration: none;
  user-select: none;
  width: ${p => (p.$isFullWidth ? '100%' : 'auto')};

  &::after {
    content: ${p => PADDING[p.size]};
  }

  &:hover {
    text-decoration: none;
  }

  &:active {
    text-decoration: none;
  }

  /* SVG Icon Components are wrapped within a <div /> */
  > div {
    margin-right: 5px;
  }
`

const ButtonLabel = styled.span`
  line-height: 1.3846;
  margin-top: -3px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const PrimaryButton = styled(NavLink)`
  background-color: ${p => p.theme.color.charcoal};
  border: 1px solid ${p => p.theme.color.charcoal};
  color: ${p => p.theme.color.gainsboro};

  :hover,
  &._hover {
    background-color: ${p => p.theme.color.blueYonder['100']};
    border: 1px solid ${p => p.theme.color.blueYonder['100']};
    color: ${p => p.theme.color.white};
  }

  :active,
  &._active {
    background-color: ${p => p.theme.color.blueGray['100']};
    border: 1px solid ${p => p.theme.color.blueGray['100']};
    color: ${p => p.theme.color.white};
  }

  :disabled,
  &._disabled {
    background-color: ${p => p.theme.color.lightGray};
    border: 1px solid ${p => p.theme.color.lightGray};
    color: ${p => p.theme.color.cultured};
  }
`

export const SecondaryButton = styled(NavLink)`
  background-color: transparent;
  border: 1px solid ${p => p.theme.color.charcoal};
  color: ${p => p.theme.color.charcoal};

  :hover,
  &._hover {
    background-color: ${p => p.theme.color.blueYonder['25']};
    border: 1px solid ${p => p.theme.color.blueYonder['100']};
    color: ${p => p.theme.color.blueYonder['100']};
  }

  :active,
  &._active {
    background-color: ${p => p.theme.color.blueGray['25']};
    border: 1px solid ${p => p.theme.color.blueGray['100']};
    color: ${p => p.theme.color.blueGray['100']};
  }

  :disabled,
  &._disabled {
    background-color: transparent;
    border: 1px solid ${p => p.theme.color.lightGray};
    color: ${p => p.theme.color.lightGray};
  }
`

export const TertiaryButton = styled(NavLink)`
  background-color: ${p => p.theme.color.white};
  border: 1px solid ${p => p.theme.color.white};
  color: ${p => p.theme.color.charcoal};

  :hover,
  &._hover {
    background-color: ${p => p.theme.color.blueYonder['25']};
    border: 1px solid ${p => p.theme.color.blueYonder['25']};
    color: ${p => p.theme.color.blueYonder['100']};
  }

  :active,
  &._active {
    background-color: ${p => p.theme.color.blueGray['25']};
    border: 1px solid ${p => p.theme.color.blueGray['100']};
    color: ${p => p.theme.color.blueGray['100']};
  }

  :disabled,
  &._disabled {
    background-color: ${p => p.theme.color.white};
    border: 1px solid ${p => p.theme.color.lightGray};
    color: ${p => p.theme.color.lightGray};
  }
`
