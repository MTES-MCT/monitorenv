import { useForceUpdate } from '@mtes-mct/monitor-ui'
import { MutableRefObject, useEffect, useRef } from 'react'
import { StyleSheetManager } from 'styled-components'

import { SideWindow } from '.'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { LegacyNewWindow } from '../../ui/NewWindow/LegacyNewWindow'
import { sideWindowActions } from './slice'

export function SideWindowLauncher() {
  const dispatch = useAppDispatch()
  const newWindowRef = useRef() as MutableRefObject<HTMLDivElement>
  const { forceUpdate } = useForceUpdate()
  useEffect(() => {
    forceUpdate()
  }, [forceUpdate])

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
