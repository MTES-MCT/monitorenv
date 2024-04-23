import { Icon, SideMenu, type NewWindowContextValue, NewWindowContext } from '@mtes-mct/monitor-ui'
import { omit } from 'lodash'
import { useEffect, useMemo, useState, useRef, type MutableRefObject } from 'react'
import { generatePath } from 'react-router'
import { ToastContainer } from 'react-toastify'
import { StyleSheetManager } from 'styled-components'

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
import { MissionFormWrapper } from '../missions/MissionForm'
import { MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES } from '../missions/MissionForm/constants'
import { useListenMissionEventUpdates } from '../missions/MissionForm/hooks/useListenMissionEventUpdates'
import { missionFormsActions } from '../missions/MissionForm/slice'
import { Missions } from '../missions/MissionsList'
import { MissionsNavBar } from '../missions/MissionsNavBar'
import { Reportings } from '../Reportings'
import { ReportingsList } from '../Reportings/ReportingsList'

export function SideWindow() {
  const dispatch = useAppDispatch()
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const currentPath = useAppSelector(state => state.sideWindow.currentPath)
  const [isFirstRender, setIsFirstRender] = useState(true)
  const missionEvent = useListenMissionEventUpdates()

  const isMissionButtonIsActive = useMemo(() => isMissionOrMissionsPage(currentPath), [currentPath])
  const isReportingsButtonIsActive = useMemo(() => isReportingsPage(currentPath), [currentPath])

  /**
   * Use to update mission opened in the side window but not actives
   */
  useEffect(() => {
    if (!missionEvent) {
      return
    }

    dispatch(missionFormsActions.updateUnactiveMission(omit(missionEvent, MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES)))
  }, [dispatch, missionEvent])

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

  useEffect(() => {
    setIsFirstRender(false)
  }, [])

  return (
    <StyleSheetManager target={wrapperRef.current ?? undefined}>
      <ErrorBoundary>
        <Wrapper ref={wrapperRef}>
          {wrapperRef.current && (
            <>
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
                  <Route element={<MissionFormWrapper />} path={sideWindowPaths.MISSION} />
                </StyledRouteContainer>
                {isReportingsButtonIsActive && (
                  <Reportings key="reportings-on-side-window" context={ReportingContext.SIDE_WINDOW} />
                )}
              </NewWindowContext.Provider>

              <ToastContainer containerId="sideWindow" />
            </>
          )}
        </Wrapper>
      </ErrorBoundary>
    </StyleSheetManager>
  )
}
