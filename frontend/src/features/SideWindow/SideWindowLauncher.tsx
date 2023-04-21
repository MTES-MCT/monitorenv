import { useForceUpdate } from '@mtes-mct/monitor-ui'
import { MutableRefObject, useCallback, useEffect, useRef } from 'react'
import { matchPath } from 'react-router'
import { StyleSheetManager } from 'styled-components'

import { SideWindow } from '.'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { LegacyNewWindow } from '../../ui/NewWindow/LegacyNewWindow'
import { SideWindowStatus, sideWindowActions } from './slice'

export function SideWindowLauncher() {
  const dispatch = useAppDispatch()
  const newWindowRef = useRef() as MutableRefObject<HTMLDivElement>
  const { forceUpdate } = useForceUpdate()

  const { sideWindow } = useAppSelector(state => state)
  const isEditMissionPage = !!matchPath(sideWindow.currentPath, {
    exact: true,
    path: sideWindowPaths.MISSION,
    strict: false
  })

  const isCreateMissionPage = !!matchPath(sideWindow.currentPath, {
    exact: true,
    path: sideWindowPaths.MISSION_NEW,
    strict: false
  })

  useEffect(() => {
    forceUpdate()
  }, [forceUpdate])

  const onChangeFocus = useCallback(
    status => {
      dispatch(sideWindowActions.onChangeStatus(status))
    },
    [dispatch]
  )

  if (sideWindow.status === SideWindowStatus.CLOSED) {
    return null
  }

  return (
    <StyleSheetManager target={newWindowRef.current}>
      <LegacyNewWindow
        closeOnUnmount
        copyStyles
        features={{ height: '1200px', scrollbars: true, width: window.innerWidth }}
        name="MonitorEnv"
        onChangeFocus={onChangeFocus}
        onUnload={() => {
          dispatch(sideWindowActions.close())
        }}
        shouldHaveFocus={sideWindow.status === SideWindowStatus.VISIBLE}
        showPrompt={isEditMissionPage || isCreateMissionPage}
        title="MonitorEnv"
      >
        <SideWindow ref={newWindowRef} />
      </LegacyNewWindow>
    </StyleSheetManager>
  )
}
