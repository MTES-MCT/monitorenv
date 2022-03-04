import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReactNewWindowStyles } from 'react-new-window-styles';
 
import { closeSideWindow } from '../../domain/shared_slices/Global'
import SideWindow from './SideWindow'

const SideWindowLauncher = () => {
  const {
    openedSideWindowTab
  } = useSelector(state => state.global)
  const dispatch = useDispatch()

  return <>{openedSideWindowTab
    ? <ReactNewWindowStyles
      autoClose
      copyStyles
      name={'MonitorEnv'}
      title={'MonitorEnv'}
      windowProps={{ scrollbars: true, width: 1500, height: 1200 }}
      onClose={() => {
        dispatch(closeSideWindow())
      }}
    >
      <SideWindow/>
    </ReactNewWindowStyles>
    : null
  }
  </>
}

export default SideWindowLauncher
