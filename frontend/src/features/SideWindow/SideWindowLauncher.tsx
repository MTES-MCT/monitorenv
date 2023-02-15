import { useForceUpdate } from '@mtes-mct/monitor-ui'
import { useEffect, useRef } from 'react'
import { StyleSheetManager } from 'styled-components'

import { SideWindow } from '.'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { LegacyNewWindow } from '../../ui/NewWindow/LegacyNewWindow'
import { sideWindowActions } from './slice'

export function SideWindowLauncher() {
  const dispatch = useAppDispatch()
  const newWindowRef = useRef<HTMLDivElement | null>(null)
  const { forceUpdate } = useForceUpdate()
  useEffect(() => {
    forceUpdate()
  }, [forceUpdate])

  // First, let's generate the right ref before passing it to <StyleSheetManager />
  if (!newWindowRef.current) {
    return <SideWindow ref={newWindowRef} />
  }

  return (
    <StyleSheetManager target={newWindowRef.current}>
      <LegacyNewWindow
        closeOnUnmount
        copyStyles
        features={{ height: '1200px', scrollbars: true, width: window.innerWidth }}
        name="MonitorEnv"
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
