import { Icon, SideMenu, type NewWindowContextValue, NewWindowContext } from '@mtes-mct/monitor-ui'
import { useEffect, useMemo, useState, useRef, type MutableRefObject } from 'react'
import { generatePath } from 'react-router'
import { ToastContainer } from 'react-toastify'
import { StyleSheetManager } from 'styled-components'

import { Route } from './Route'
import { sideWindowActions } from './slice'
import { StyledRouteContainer, Wrapper } from './style'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { MissionEventContext } from '../../context/MissionEventContext'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { ReportingContext } from '../../domain/shared_slices/Global'
import { switchTab } from '../../domain/use_cases/missions/switchTab'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { isMissionOrMissionsPage, isMissionPage, isReportingsPage } from '../../utils/routes'
import { MissionFormWrapper } from '../missions/MissionForm'
import { useListenMissionEventUpdates } from '../missions/MissionForm/hooks/useListenMissionEventUpdates'
import { Missions } from '../missions/MissionsList'
import { MissionsNavBar } from '../missions/MissionsNavBar'
import { Reportings } from '../Reportings'
import { ReportingsList } from '../Reportings/ReportingsList'

export function SideWindow() {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const currentPath = useAppSelector(state => state.sideWindow.currentPath)
  const activeMissionId = useAppSelector(state => state.missionForms.activeMissionId)
  const selectedMissions = useAppSelector(state => state.missionForms.missions)
  const missionEvent = useListenMissionEventUpdates()

  // TODO Update all missions in redux state when receiving an event
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('selectedMissions', selectedMissions)
    // eslint-disable-next-line no-console
    console.log('activeMissionId', activeMissionId)
  }, [activeMissionId, selectedMissions])

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

  useEffect(() => {
    setIsFirstRender(false)
  }, [])

  return (
    <StyleSheetManager target={wrapperRef.current || undefined}>
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
                  <MissionEventContext.Provider value={missionEvent}>
                    <Route element={<MissionFormWrapper />} path={sideWindowPaths.MISSION} />
                  </MissionEventContext.Provider>
                </StyledRouteContainer>
                {isReportingsButtonIsActive && (
                  <Reportings key="reportings-on-side-window" context={ReportingContext.SIDE_WINDOW} />
                )}
              </NewWindowContext.Provider>

              <ToastContainer containerId="sideWindow" enableMultiContainer />
            </>
          )}
        </Wrapper>
      </ErrorBoundary>
    </StyleSheetManager>
  )
}
