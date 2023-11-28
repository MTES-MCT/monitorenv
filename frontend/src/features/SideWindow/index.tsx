import { Icon, SideMenu, type NewWindowContextValue, NewWindowContext } from '@mtes-mct/monitor-ui'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState, useRef } from 'react'
import { generatePath } from 'react-router'
import { ToastContainer } from 'react-toastify'

import { Route } from './Route'
import { sideWindowActions } from './slice'
import { StyledRouteContainer, Wrapper } from './style'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { ReportingContext } from '../../domain/shared_slices/Global'
import { switchTab } from '../../domain/use_cases/missions/switchTab'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { isMissionOrMissionsPage, isMissionPage, isReportingsPage } from '../../utils/routes'
import { Mission } from '../missions/MissionForm'
import { Missions } from '../missions/MissionsList'
import { MissionsNavBar } from '../missions/MissionsNavBar'
import { Reportings } from '../Reportings'
import { ReportingsList } from '../Reportings/ReportingsList'

import type { ForwardedRef, MutableRefObject } from 'react'

function SideWindowWithRef(_, ref: ForwardedRef<HTMLDivElement | null>) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const currentPath = useAppSelector(state => state.sideWindow.currentPath)

  const [isFirstRender, setIsFirstRender] = useState(true)

  const dispatch = useAppDispatch()

  const isMissionButtonIsActive = useMemo(() => isMissionOrMissionsPage(currentPath), [currentPath])
  const isReportingsButtonIsActive = useMemo(() => isReportingsPage(currentPath), [currentPath])

  const navigate = nextPath => {
    if (!nextPath) {
      return
    }
    const isCurrentPathIsMissionPage = isMissionPage(currentPath)
    if (isCurrentPathIsMissionPage) {
      dispatch(switchTab(nextPath))
    } else {
      dispatch(sideWindowActions.setCurrentPath(nextPath))
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
                onClick={() => navigate(generatePath(sideWindowPaths.MISSIONS))}
                title="missions"
              />
              <SideMenu.Button
                Icon={Icon.Report}
                isActive={isReportingsButtonIsActive}
                onClick={() => navigate(generatePath(sideWindowPaths.REPORTINGS))}
                title="signalements"
              />
            </SideMenu>

            <StyledRouteContainer>
              <Route element={<ReportingsList />} path={sideWindowPaths.REPORTINGS} />
              <Route element={<MissionsNavBar />} path={[sideWindowPaths.MISSIONS, sideWindowPaths.MISSION]} />
              <Route element={<Missions />} path={sideWindowPaths.MISSIONS} />
              <Route element={<Mission />} path={sideWindowPaths.MISSION} />
            </StyledRouteContainer>
          </NewWindowContext.Provider>
        )}
        {isReportingsButtonIsActive && (
          <Reportings key="reportings-on-side-window" context={ReportingContext.SIDE_WINDOW} />
        )}
        <ToastContainer containerId="sideWindow" enableMultiContainer />
      </Wrapper>
    </ErrorBoundary>
  )
}

export const SideWindow = forwardRef(SideWindowWithRef)
