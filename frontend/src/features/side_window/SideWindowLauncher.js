import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheetManager } from 'styled-components'

import { closeSideWindow } from '../../domain/shared_slices/Global'
import { NewWindow } from './NewWindow'
import { SideWindow } from './SideWindow'

function SideWindowLauncher() {
  const { openedSideWindowTab } = useSelector(state => state.global)
  const dispatch = useDispatch()
  const newWindowRef = useRef(null)

  return (
    <>
      {openedSideWindowTab ? (
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
      ) : null}
    </>
  )
}

export default SideWindowLauncher
