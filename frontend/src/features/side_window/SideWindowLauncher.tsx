import { MutableRefObject, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { StyleSheetManager } from 'styled-components'

import { closeSideWindow } from '../../components/SideWindowRouter/SideWindowRouter.slice'
import { useAppSelector } from '../../hooks/useAppSelector'
import { NewWindow } from './NewWindow'
import { SideWindow } from './SideWindow'

export function SideWindowLauncher() {
  const { openedSideWindowTab } = useAppSelector(state => state.sideWindowRouter)
  const dispatch = useDispatch()
  const newWindowRef = useRef() as MutableRefObject<HTMLDivElement>

  return openedSideWindowTab ? (
    <StyleSheetManager target={newWindowRef.current}>
      <NewWindow
        closeOnUnmount
        copyStyles
        features={{ height: '1000px', scrollbars: true, width: '1800px' }}
        name="MonitorEnv"
        onUnload={() => {
          dispatch(closeSideWindow())
        }}
        title="MonitorEnv"
      >
        <SideWindow ref={newWindowRef} />
      </NewWindow>
    </StyleSheetManager>
  ) : null
}
