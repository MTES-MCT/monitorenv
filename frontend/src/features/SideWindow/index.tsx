import { Icon, SideMenu } from '@mtes-mct/monitor-ui'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { generatePath, matchPath } from 'react-router'
import { ToastContainer } from 'react-toastify'

import { Route } from './Route'
import { StyledContainer, Wrapper } from './style'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { switchTab } from '../../domain/use_cases/navigation/switchTab'
import { useAppSelector } from '../../hooks/useAppSelector'
import { NewWindowContext } from '../../ui/NewWindow'
import { Mission } from '../missions/MissionForm'
import { Missions } from '../missions/MissionsList'
import { MissionsNavBar } from '../missions/MissionsNavBar'
import { ReportingsList } from '../Reportings/ReportingsList'

import type { NewWindowContextValue } from '../../ui/NewWindow'
import type { ForwardedRef, MutableRefObject } from 'react'

function SideWindowWithRef(_, ref: ForwardedRef<HTMLDivElement | null>) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const {
    sideWindow: { currentPath }
  } = useAppSelector(state => state)

  const [isFirstRender, setIsFirstRender] = useState(true)

  const dispatch = useDispatch()

  const isMissionButtonIsActive = useMemo(() => {
    const isMissionPage = !!matchPath<'id', string>(
      {
        end: true,
        path: sideWindowPaths.MISSION
      },
      currentPath as string
    )

    const isMissionsPage = !!matchPath(
      {
        end: true,
        path: sideWindowPaths.MISSIONS
      },
      currentPath as string
    )

    return isMissionPage || isMissionsPage
  }, [currentPath])

  const selectTab = nextPath => {
    if (nextPath) {
      dispatch(switchTab(nextPath))
    }
  }

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
              <SideMenu.Button
                Icon={Icon.MissionAction}
                isActive={isMissionButtonIsActive}
                onClick={() => selectTab(generatePath(sideWindowPaths.MISSIONS))}
                title="missions"
              />
              <SideMenu.Button
                Icon={Icon.Report}
                isActive={currentPath === sideWindowPaths.REPORTINGS}
                onClick={() => selectTab(generatePath(sideWindowPaths.REPORTINGS))}
                title="signalements"
              />
            </SideMenu>

            <StyledContainer>
              <Route element={<ReportingsList />} path={sideWindowPaths.REPORTINGS} />
              <Route element={<MissionsNavBar />} path={[sideWindowPaths.MISSIONS, sideWindowPaths.MISSION]} />
              <Route element={<Missions />} path={sideWindowPaths.MISSIONS} />
              <Route element={<Mission />} path={sideWindowPaths.MISSION} />
            </StyledContainer>
          </NewWindowContext.Provider>
        )}
        <ToastContainer containerId="sideWindow" enableMultiContainer />
      </Wrapper>
    </ErrorBoundary>
  )
}

export const SideWindow = forwardRef(SideWindowWithRef)
