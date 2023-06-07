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

  const { missionState, sideWindow } = useAppSelector(state => state)
  const isEditMissionPage = !!matchPath<'id', string>(
    {
      end: true,
      path: sideWindowPaths.MISSION
    },
    sideWindow.currentPath
  )

  const isCreateMissionPage = !!matchPath(
    {
      end: true,
      path: sideWindowPaths.MISSION_NEW
    },
    sideWindow.currentPath
  )

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
        showPrompt={(isEditMissionPage || isCreateMissionPage) && missionState.isFormDirty}
        title="MonitorEnv"
      >
        <SideWindow ref={newWindowRef} />
      </LegacyNewWindow>
    </StyleSheetManager>
  )
}
