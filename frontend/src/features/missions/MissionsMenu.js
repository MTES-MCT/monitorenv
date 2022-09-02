import React from 'react'
import styled from 'styled-components'
import { IconButton } from 'rsuite'
import { useDispatch, useSelector } from 'react-redux'

import { closeSideWindow, openSideWindowTab } from '../../domain/shared_slices/Global'
import { sideWindowMenu } from '../../domain/entities/sideWindow'

import { ReactComponent as MissionsSVG } from '../../uiMonitor/icons/operations.svg'

export const MissionsMenu = () => {
  const dispatch = useDispatch()
  const {
    openedSideWindowTab,
    sideWindowIsOpen
  } = useSelector(state => state.global)

  const toggleMissionsWindow = () => {
    if (!sideWindowIsOpen || (sideWindowIsOpen && openedSideWindowTab !== sideWindowMenu.MISSIONS.code)) {
      dispatch(openSideWindowTab(sideWindowMenu.MISSIONS.code))      
    } else if (sideWindowIsOpen && openedSideWindowTab === sideWindowMenu.MISSIONS.code) {
      dispatch(closeSideWindow())
    }
  }

  return (
    <MissionButton
      data-cy={'missions-button'}
      title={'voir les missions'}
      onClick={toggleMissionsWindow}
      icon={<MissionsIcon className={'rs-icon'} />}
      appearance='primary'
      active={sideWindowIsOpen}
    >
    </MissionButton>
  )
}

const MissionButton = styled(IconButton)`
  position: absolute;
  top: 55px;
  right: 10px;
`
const MissionsIcon = styled(MissionsSVG)`
  width: 16px;
  height: 16px;
`
