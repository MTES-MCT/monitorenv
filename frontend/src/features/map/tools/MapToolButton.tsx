import { IconButton, type IconProps, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { useAppSelector } from '../../../hooks/useAppSelector'

import type { CSSProperties, FunctionComponent } from 'react'

type MapToolButtonProps = {
  dataCy?: string
  icon: FunctionComponent<IconProps>
  isHidden: boolean
  isOpen: boolean
  onClick: () => void
  style?: CSSProperties
  title: string
}
export function MapToolButton({ dataCy, icon, isHidden, isOpen, onClick, style, title }: MapToolButtonProps) {
  const { healthcheckTextWarning } = useAppSelector(state => state.global)

  return (
    <StyledMapToolButton
      $healthcheckTextWarning={!!healthcheckTextWarning}
      $isHidden={isHidden}
      className={isOpen ? '_active' : undefined}
      data-cy={dataCy}
      Icon={icon}
      onClick={onClick}
      size={Size.LARGE}
      style={style}
      title={title}
    />
  )
}

// TODO delete padding when Monitor-ui component have good padding
const StyledMapToolButton = styled(IconButton)<{
  $healthcheckTextWarning: boolean
  $isHidden: boolean
}>`
  padding: 6px;
  transition: all 0.3s;
  margin-top: ${p => (p.$healthcheckTextWarning ? 50 : 0)}px;
  visibility: ${p => (p.$isHidden ? 'hidden' : 'visible')};
`
