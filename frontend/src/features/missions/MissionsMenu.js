import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'

import { closeSideWindow, openSideWindowTab } from '../../domain/shared_slices/Global'
import { sideWindowMenu, sideWindowPaths } from '../../domain/entities/sideWindow'

import { RightMenuButton } from "../commonComponents/RightMenuButton/RightMenuButton"
import { ReactComponent as MissionsSVG } from '../icons/Picto_resume.svg'
import { setSideWindowPath } from '../commonComponents/SideWindowRouter/SideWindowRouter.slice'

export const MissionsMenu = () => {
  const dispatch = useDispatch()
  const {
    openedSideWindowTab,
    sideWindowIsOpen
  } = useSelector(state => state.global)

  const toggleMissionsWindow = () => {
    if (!sideWindowIsOpen || (sideWindowIsOpen && openedSideWindowTab !== sideWindowMenu.MISSIONS.code)) {
      dispatch(openSideWindowTab(sideWindowMenu.MISSIONS.code))
      dispatch(setSideWindowPath(sideWindowPaths.MISSIONS))
      return
    }

    if (sideWindowIsOpen && openedSideWindowTab === sideWindowMenu.MISSIONS.code) {
      dispatch(closeSideWindow())
    }
  }

  return (<>
    <RightMenuButton
      top={55}
      data-cy={'missions-button'}
      title={'Missions'}
      onClick={toggleMissionsWindow}
      button={<MissionsIcon/>}
    >
    </RightMenuButton>
  </>
  )
}

const MissionsIcon = styled(MissionsSVG)`
  margin-top: 5px;
  width: 20px;
`
