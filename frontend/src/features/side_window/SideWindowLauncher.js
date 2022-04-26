import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NewWindow from 'react-new-window'
import { StyleSheetManager } from 'styled-components' 
 
import { closeSideWindow } from '../../domain/shared_slices/Global'
import { SideWindow } from './SideWindow'

const SideWindowLauncher = () => {
  const { openedSideWindowTab } = useSelector(state => state.global)
  const dispatch = useDispatch()
  const newWindowRef = useRef(null)

  return (<>
  {openedSideWindowTab ? 
    <StyleSheetManager target={newWindowRef.current}>
      <NewWindow
          copyStyles
          closeOnUnmount
          name={'MonitorEnv'}
          title={'MonitorEnv'}
          features={{ scrollbars: true, width: '1500px', height: '1200px' }}
          onUnload={() => {
            dispatch(closeSideWindow())
          }}
        >
        <SideWindow ref={newWindowRef} />
      </NewWindow>
    </StyleSheetManager>
    : null
  }
  </>)
}

export default SideWindowLauncher
