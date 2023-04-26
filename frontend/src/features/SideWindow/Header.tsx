import { Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { COLORS } from '../../constants/constants'

import type React from 'react'

type HeaderProps = {
  children?: React.ReactNode
  onClose?: () => void
  title?: string
  withCloseButton?: boolean
}
export function Header({ children, onClose, title, withCloseButton = false }: HeaderProps) {
  return (
    <Wrapper>
      <div>
        <Title data-cy="SideWindowHeader-title">{title}</Title>
        {children}
      </div>

      {withCloseButton && <IconButton Icon={Icon.Close} onClick={onClose} />}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: ${COLORS.charcoal};
  padding-left: 8px;
  padding-right: 8px;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Title = styled.h1`
  display: inline-block;
  color: ${COLORS.white};
  font-size: 22px;
  line-height: 50px;
  margin-left: 8px;
  margin-right: 8px;
`
