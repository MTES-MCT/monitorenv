import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { sideWindowMenu } from '../../domain/entities/sideWindow'
import { closeSideWindow, openSideWindowTab } from '../../domain/shared_slices/Global'
import { ReactComponent as MissionsSVG } from '../../uiMonitor/icons/Operations.svg'

export function MissionsMenu() {
  const dispatch = useDispatch()
  const { openedSideWindowTab, sideWindowIsOpen } = useSelector(state => state.global)

  const toggleMissionsWindow = () => {
    if (!sideWindowIsOpen || (sideWindowIsOpen && openedSideWindowTab !== sideWindowMenu.MISSIONS.code)) {
      dispatch(openSideWindowTab(sideWindowMenu.MISSIONS.code))
    } else if (sideWindowIsOpen && openedSideWindowTab === sideWindowMenu.MISSIONS.code) {
      dispatch(closeSideWindow())
    }
  }

  return (
    <MissionButton
      active={sideWindowIsOpen}
      appearance="primary"
      data-cy="missions-button"
      icon={<MissionsIcon className="rs-icon" />}
      onClick={toggleMissionsWindow}
      size="lg"
      title="voir les missions"
    />
  )
}

const MissionButton = styled(IconButton)`
  position: absolute;
  top: 55px;
  right: 10px;
`
const MissionsIcon = styled(MissionsSVG)``
