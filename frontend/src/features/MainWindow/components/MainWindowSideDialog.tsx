import { MapMenuDialog } from '@mtes-mct/monitor-ui'
import { useEffect, type ReactNode } from 'react'
import styled from 'styled-components'

import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { mainWindowActions } from '../slice'

type MainWindowSideDialogProps = {
  children?: ReactNode
}
export function MainWindowSideDialog({ children }: MainWindowSideDialogProps) {
  const mainWindow = useAppSelector(state => state.mainWindow)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(mainWindowActions.setIsSideWindowOpen(true))

    return () => {
      dispatch(mainWindowActions.setIsSideWindowOpen(false))
    }
  }, [dispatch])

  return <Wrapper $isShifted={mainWindow.isRightMenuHovered}>{children},?</Wrapper>
}

export const Wrapper = styled(MapMenuDialog.Container)<{
  $isShifted: boolean
}>`
  background-color: ${p => p.theme.color.white};
  bottom: 0;
  display: flex;
  max-height: none;
  overflow: hidden;
  margin: 0;
  position: absolute;
  right: ${p => (p.$isShifted ? '60px' : '8px')};
  top: 0;
  transition: right 0.5s ease-out, top 0.5s ease-out;
  width: 500px;
  /* TODO Normalize a strategy for z-indexes between dialogs, modals, menus, etc. */
  z-index: 1;
`
