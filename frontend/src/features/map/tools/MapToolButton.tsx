import { IconButton, IconProps, Size } from '@mtes-mct/monitor-ui'
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
      $isOpen={isOpen}
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

const StyledMapToolButton = styled(IconButton)<{
  $healthcheckTextWarning: boolean
  $isHidden: boolean
  $isOpen: boolean
}>`
  position: absolute;
  padding: 6px;
  z-index: 99;
  right: 10px;
  transition: all 0.3s;
  margin-top: ${p => (p.$healthcheckTextWarning ? 50 : 0)}px;
  visibility: ${p => (p.$isHidden ? 'hidden' : 'visible')};
`
