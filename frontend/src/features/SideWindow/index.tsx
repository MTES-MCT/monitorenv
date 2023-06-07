import { forwardRef, useEffect, useImperativeHandle, useMemo, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'

import { ErrorBoundary } from '../../components/ErrorBoundary'
import { COLORS } from '../../constants/constants'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { NewWindowContext } from '../../ui/NewWindow'
import { Mission } from '../missions/MissionForm'
import { Missions } from '../missions/MissionsList'
import { Route } from './Route'

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
  }, [dispatch])

  return (
    <ErrorBoundary>
      <Wrapper ref={wrapperRef}>
        {!isFirstRender && (
          <NewWindowContext.Provider value={newWindowContextProviderValue}>
            <Route element={<Missions />} path={sideWindowPaths.MISSIONS} />
            <Route element={<Mission />} path={sideWindowPaths.MISSION} />
            <Route element={<Mission />} path={sideWindowPaths.MISSION_NEW} />
          </NewWindowContext.Provider>
        )}
        <ToastContainer containerId="sideWindow" enableMultiContainer />
      </Wrapper>
    </ErrorBoundary>
  )
}

const Wrapper = styled.div`
  height: 100vh;
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

export const SideWindow = forwardRef(SideWindowWithRef)
