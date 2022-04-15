import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FulfillingBouncingCircleSpinner } from 'react-epic-spinners'
import styled from 'styled-components'

import {  setSideWindowAsOpen } from '../../domain/shared_slices/Global'

import SideWindowSubMenu from './SideWindowSubMenu'
import SideWindowMenu from './SideWindowMenu'
import { COLORS } from '../../constants/constants'
import { MissionsWrapper } from '../missions/MissionsWrapper'

const SideWindow = () => {
  const {
    openedSideWindowTab
  } = useSelector(state => state.global)
  const dispatch = useDispatch()
  const [isPreloading, setIsPreloading] = useState(true)
  const [selectedSubMenu, setSelectedSubMenu] = useState()

  useEffect(() => {
    if (openedSideWindowTab) {
      dispatch(setSideWindowAsOpen())

      setTimeout(() => {
        setIsPreloading(false)
      }, 500)
    }
  }, [openedSideWindowTab])




  return <>{openedSideWindowTab
    ? <Wrapper>
      <SideWindowMenu
        selectedMenu={openedSideWindowTab}
      />
      <SideWindowSubMenu
        selectedMenu={openedSideWindowTab}
        selectedSubMenu={selectedSubMenu}
        setSelectedSubMenu={setSelectedSubMenu}
      />
      {
        isPreloading
          ? <Loading>
            <FulfillingBouncingCircleSpinner
              color={COLORS.grayShadow}
              className={'update-vessels'}
              size={100}/>
            <Text data-cy={'first-loader'}>Chargement...</Text>
          </Loading>
          : 
            <MissionsWrapper/>
      }
    </Wrapper>
    : null
  }
  </>
}


const Loading = styled.div`
  margin-top: 350px;
  margin-left: 550px;
`

const Text = styled.span`
  margin-top: 10px;
  font-size: 13px;
  color: ${COLORS.grayShadow};
  bottom: -17px;
  position: relative;
`

const Wrapper = styled.div`
  display: flex;
  background: ${COLORS.white};
  
  @keyframes blink {
    0%   {
      background: ${COLORS.background};
    }
    50% {
      background: ${COLORS.lightGray};
    }
    0% {
      background: ${COLORS.background};
    }
  }
`

export default SideWindow
