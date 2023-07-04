import { Icon, SideMenu } from '@mtes-mct/monitor-ui'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { generatePath } from 'react-router'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'

import { Route } from './Route'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { COLORS } from '../../constants/constants'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { onNavigateDuringEditingMission } from '../../domain/use_cases/navigation/onNavigateBetweenMapAndSideWindow'
import { NewWindowContext } from '../../ui/NewWindow'
import { Mission } from '../missions/MissionForm'
import { Missions } from '../missions/MissionsList'

import type { NewWindowContextValue } from '../../ui/NewWindow'
import type { ForwardedRef, MutableRefObject } from 'react'

function SideWindowWithRef(_, ref: ForwardedRef<HTMLDivElement | null>) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const [isFirstRender, setIsFirstRender] = useState(true)

  const dispatch = useDispatch()

  const newWindowContextProviderValue: NewWindowContextValue = useMemo(
    () => ({
      newWindowContainerRef: wrapperRef.current
        ? (wrapperRef as MutableRefObject<HTMLDivElement>)
        : { current: window.document.createElement('div') }
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFirstRender]
  )

  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => wrapperRef.current)

  useEffect(() => {
    setIsFirstRender(false)
  }, [])

  return (
    <ErrorBoundary>
      <Wrapper ref={wrapperRef}>
        {!isFirstRender && (
          <NewWindowContext.Provider value={newWindowContextProviderValue}>
            <SideMenu>
              {/* TODO manage active cases when other buttons are implemented */}
              <SideMenu.Button
                Icon={Icon.MissionAction}
                isActive
                onClick={() => dispatch(onNavigateDuringEditingMission(generatePath(sideWindowPaths.MISSIONS)))}
                title="missions"
              />
            </SideMenu>
            <StyledContainer>
              <Route element={<Missions />} path={sideWindowPaths.MISSIONS} />
              <Route element={<Mission />} path={sideWindowPaths.MISSION} />
              <Route element={<Mission />} path={sideWindowPaths.MISSION_NEW} />
            </StyledContainer>
          </NewWindowContext.Provider>
        )}
        <ToastContainer containerId="sideWindow" enableMultiContainer />
      </Wrapper>
    </ErrorBoundary>
  )
}

const Wrapper = styled.section`
  background: ${p => p.theme.color.white};
  display: flex;
  flex: 1;
  height: 100%;
  min-height: 0;
  min-width: 0;

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

const StyledContainer = styled.section`
  display: flex;
  flex: 1;
`

export const SideWindow = forwardRef(SideWindowWithRef)
