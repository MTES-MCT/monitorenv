import { forwardRef } from 'react'
import styled from 'styled-components'

import { ErrorBoundary } from '../../components/ErrorBoundary'
import { SideWindowRoute } from '../../components/SideWindowRouter/SideWindowRoute'
import { COLORS } from '../../constants/constants'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { useAppSelector } from '../../hooks/useAppSelector'
import { CreateOrEditMission } from '../missions/CreateOrEditMission'
import { Missions } from '../missions/Missions'

export const SideWindow = forwardRef<HTMLDivElement>((_, ref) => {
  const { openedSideWindowTab } = useAppSelector(state => state.sideWindowRouter)

  return openedSideWindowTab ? (
    <ErrorBoundary>
      <Wrapper ref={ref}>
        <>
          <SideWindowRoute path={sideWindowPaths.MISSIONS}>
            <Missions />
          </SideWindowRoute>
          <SideWindowRoute path={[sideWindowPaths.MISSION, sideWindowPaths.MISSION_NEW]}>
            <CreateOrEditMission />
          </SideWindowRoute>
        </>
      </Wrapper>
    </ErrorBoundary>
  ) : null
})

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
