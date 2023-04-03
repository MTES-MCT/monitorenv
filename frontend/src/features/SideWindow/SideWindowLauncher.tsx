import { useForceUpdate } from '@mtes-mct/monitor-ui'
import { MutableRefObject, useEffect, useRef } from 'react'
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
  const isEditMissionPage = matchPath(sideWindow.currentPath, {
    exact: true,
    path: sideWindowPaths.MISSION,
    strict: false
  })

  const isCreateMissionPage = matchPath(sideWindow.currentPath, {
    exact: true,
    path: sideWindowPaths.MISSION_NEW,
    strict: false
  })

  useEffect(() => {
    forceUpdate()
  }, [forceUpdate])

  if (sideWindow.status === SideWindowStatus.CLOSED) {
    return null
  }

  return (
    <StyleSheetManager target={newWindowRef.current}>
      <LegacyNewWindow
        closeOnUnmount
        copyStyles
        doFocus={sideWindow.status === SideWindowStatus.VISIBLE}
        features={{ height: '1200px', scrollbars: true, width: window.innerWidth }}
        name="MonitorEnv"
        onChangeFocus={status => dispatch(sideWindowActions.onChangeStatus(status))}
        onUnload={() => {
          dispatch(sideWindowActions.close())
        }}
        showPrompt={!!isEditMissionPage || !!isCreateMissionPage}
        title="MonitorEnv"
      >
        <SideWindow ref={newWindowRef} />
      </LegacyNewWindow>
    </StyleSheetManager>
  )
}
