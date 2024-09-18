import { forwardRef } from 'react'
import styled from 'styled-components'

import { useAppSelector } from '../../../../hooks/useAppSelector'

type ButtonWrapperProps = {
  children: React.ReactNode
  topPosition: number
}
export function ButtonWrapperWithRef({ children, topPosition }: ButtonWrapperProps, ref: React.Ref<HTMLDivElement>) {
  const hasFullHeightRightDialogOpen = useAppSelector(state => state.mainWindow.hasFullHeightRightDialogOpen)
  const isRightMenuOpened = useAppSelector(state => state.mainWindow.isRightMenuOpened)

  return (
    <Wrapper
      ref={ref}
      $hasFullHeightRightDialogOpen={hasFullHeightRightDialogOpen}
      $isRightMenuOpened={isRightMenuOpened}
      $topPosition={topPosition}
    >
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div<{
  $hasFullHeightRightDialogOpen: boolean
  $isRightMenuOpened: boolean
  $topPosition: number
}>`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  right: ${p => (!p.$hasFullHeightRightDialogOpen || p.$isRightMenuOpened ? 10 : 0)}px;
  top: ${p => p.$topPosition}px;
  transition: right 0.3s ease-out;
`

export const ButtonWrapper = forwardRef(ButtonWrapperWithRef)
