import React, { forwardRef, useEffect, useState } from 'react'
import { FulfillingBouncingCircleSpinner } from 'react-epic-spinners'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { ErrorBoundary } from '../../components/ErrorBoundary'
import { SideWindowRoute } from '../../components/SideWindowRouter/SideWindowRoute'
import { COLORS } from '../../constants/constants'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { setSideWindowAsOpen } from '../../domain/shared_slices/Global'
import { CreateOrEditMission } from '../missions/CreateOrEditMission'
import { Missions } from '../missions/Missions'

// import SideWindowMenu from './SideWindowMenu'

export const SideWindow = forwardRef((props, ref) => {
  const { openedSideWindowTab } = useSelector(state => state.global)
  const dispatch = useDispatch()
  const [isPreloading, setIsPreloading] = useState(true)

  useEffect(() => {
    if (openedSideWindowTab) {
      dispatch(setSideWindowAsOpen())

      setTimeout(() => {
        setIsPreloading(false)
      }, 500)
    }
  }, [openedSideWindowTab])

  return (
    <>
      {openedSideWindowTab ? (
        <ErrorBoundary>
          <Wrapper ref={ref}>
            {isPreloading ? (
              <Loading>
                <FulfillingBouncingCircleSpinner color={COLORS.slateGray} size={100} />
                <Text data-cy="first-loader">Chargement...</Text>
              </Loading>
            ) : (
              <>
                <SideWindowRoute path={sideWindowPaths.MISSIONS}>
                  <Missions />
                </SideWindowRoute>
                <SideWindowRoute path={[sideWindowPaths.MISSION, sideWindowPaths.MISSION_NEW]}>
                  <CreateOrEditMission />
                </SideWindowRoute>
              </>
            )}
          </Wrapper>
        </ErrorBoundary>
      ) : null}
    </>
  )
})

const Loading = styled.div`
  margin-top: 350px;
  margin-left: 550px;
`

const Text = styled.span`
  margin-top: 10px;
  font-size: 13px;
  color: ${COLORS.slateGray};
  bottom: -17px;
  position: relative;
`

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  background: ${COLORS.white};

  @keyframes blink {
    0% {
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
