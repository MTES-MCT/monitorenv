import { NewWindow, useForceUpdate } from '@mtes-mct/monitor-ui'
import { MutableRefObject, useCallback, useEffect, useRef } from 'react'
import { StyleSheetManager } from 'styled-components'

import { SideWindow } from '.'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { editMissionPageRoute, newMissionPageRoute } from '../../utils/isEditOrNewMissionPage'
import { SideWindowStatus, sideWindowActions } from './slice'

export function SideWindowLauncher() {
  const dispatch = useAppDispatch()
  const newWindowRef = useRef() as MutableRefObject<HTMLDivElement>
  const { forceUpdate } = useForceUpdate()

  const { missionState, sideWindow } = useAppSelector(state => state)
  const isEditMissionPage = !!editMissionPageRoute(sideWindow.currentPath)

  const isCreateMissionPage = !!newMissionPageRoute(sideWindow.currentPath)

  useEffect(() => {
    forceUpdate()
  }, [forceUpdate])

  const onChangeFocus = useCallback(
    isFocused => {
      const nextStatus = isFocused ? SideWindowStatus.VISIBLE : SideWindowStatus.HIDDEN
      dispatch(sideWindowActions.onChangeStatus(nextStatus))
    },
    [dispatch]
  )

  if (sideWindow.status === SideWindowStatus.CLOSED) {
    return null
  }

  return (
    <StyleSheetManager target={newWindowRef.current}>
      <NewWindow
        closeOnUnmount
        copyStyles
        features={{ height: 1200, width: window.innerWidth }}
        name="MonitorEnv"
        onChangeFocus={onChangeFocus}
        onUnload={() => {
          dispatch(sideWindowActions.close())
        }}
        shouldHaveFocus={sideWindow.status === SideWindowStatus.VISIBLE}
        showPrompt={(isEditMissionPage || isCreateMissionPage) && missionState.isFormDirty}
        title="MonitorEnv"
      >
        <SideWindow ref={newWindowRef} />
      </NewWindow>
    </StyleSheetManager>
  )
}
