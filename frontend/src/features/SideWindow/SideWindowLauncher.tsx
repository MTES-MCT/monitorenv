import { useForceUpdate } from '@mtes-mct/monitor-ui'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { StyleSheetManager } from 'styled-components'

import { SideWindow } from '.'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { LegacyNewWindow } from '../../ui/NewWindow/LegacyNewWindow'
import { sideWindowActions } from './slice'

export function SideWindowLauncher() {
  const dispatch = useAppDispatch()
  const newWindowRef = useRef() as MutableRefObject<HTMLDivElement>
  const { forceUpdate } = useForceUpdate()

  const { sideWindow } = useAppSelector(state => state)
  const { missionState } = useAppSelector(state => state.missionState)
  const { listener } = useAppSelector(state => state.draw)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (sideWindow.status === 'hidden' && missionState && !listener) {
      setIsFocused(true)
    }
  }, [sideWindow.status, missionState, listener])

  useEffect(() => {
    forceUpdate()
  }, [forceUpdate])

  if (sideWindow.status === 'closed') {
    return null
  }

  return (
    <StyleSheetManager target={newWindowRef.current}>
      <LegacyNewWindow
        closeOnUnmount
        copyStyles
        doFocus={isFocused}
        features={{ height: '1200px', scrollbars: true, width: window.innerWidth }}
        name="MonitorEnv"
        onChangeFocus={status => dispatch(sideWindowActions.onChangeStatus(status))}
        onUnload={() => {
          dispatch(sideWindowActions.close())
        }}
        title="MonitorEnv"
      >
        <SideWindow ref={newWindowRef} />
      </LegacyNewWindow>
    </StyleSheetManager>
  )
}
