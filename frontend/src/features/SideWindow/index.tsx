import { useForceUpdate } from '@mtes-mct/monitor-ui'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import styled, { StyleSheetManager } from 'styled-components'

import { ErrorBoundary } from '../../components/ErrorBoundary'
import { COLORS } from '../../constants/constants'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { NewWindowContext } from '../../ui/NewWindow'
import { LegacyNewWindow } from '../../ui/NewWindow/LegacyNewWindow'
import { CreateOrEditMission } from '../missions/CreateOrEditMission'
import { Missions } from '../missions/Missions'
import { Route } from './Route'
import { sideWindowActions } from './slice'

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
        : {
            current: window.document.createElement('div')
          }
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
            <Route path={sideWindowPaths.MISSIONS}>
              <Missions />
            </Route>
            <Route path={[sideWindowPaths.MISSION, sideWindowPaths.MISSION_NEW]}>
              <CreateOrEditMission />
            </Route>
          </NewWindowContext.Provider>
        )}
      </Wrapper>
    </ErrorBoundary>
  )
}

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

function Portal() {
  const newWindowRef = useRef<HTMLDivElement | null>(null)

  const dispatch = useDispatch()

  const { forceUpdate } = useForceUpdate()

  useEffect(() => {
    forceUpdate()
  }, [forceUpdate])

  // First, let's generate the right ref before passing it to <StyleSheetManager />
  if (!newWindowRef.current) {
    return <SideWindow ref={newWindowRef} />
  }

  return (
    <StyleSheetManager target={newWindowRef.current}>
      <LegacyNewWindow
        closeOnUnmount
        copyStyles
        features={{ height: '1000px', scrollbars: true, width: '1800px' }}
        name="MonitorEnv"
        onUnload={() => {
          dispatch(sideWindowActions.close())
        }}
        title="MonitorEnv"
      >
        <SideWindow ref={newWindowRef} />
      </LegacyNewWindow>
    </StyleSheetManager>
  )
}

export const SideWindow = Object.assign(forwardRef(SideWindowWithRef), {
  Portal
})
