import { DashboardForms } from '@features/Dashboard/components/DashboardForm'
import { DashboardsList } from '@features/Dashboard/components/DashboardsList'
import { DashboardsNavBar } from '@features/Dashboard/components/DashboardsNavBar'
import { dashboardActions } from '@features/Dashboard/slice'
import { MissionFormWrapper } from '@features/Mission/components/MissionForm'
import { Missions } from '@features/Mission/components/MissionsList'
import { switchTab } from '@features/Mission/useCases/switchTab'
import { REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES } from '@features/Reportings/components/ReportingForm/constants'
import { useListenReportingEventUpdates } from '@features/Reportings/components/ReportingForm/hooks/useListenReportingEventUpdates'
import { ReportingsList } from '@features/Reportings/components/ReportingsList'
import { reportingActions } from '@features/Reportings/slice'
import { VigilancesAreasList } from '@features/VigilanceArea/components/VigilanceAreasList'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, NewWindowContext, SideMenu, type NewWindowContextValue } from '@mtes-mct/monitor-ui'
import {
  isDashboardPage,
  isDashboardsPage,
  isMissionOrMissionsPage,
  isMissionPage,
  isReportingsPage
} from '@utils/routes'
import { omit } from 'lodash'
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import { generatePath } from 'react-router'
import { ToastContainer } from 'react-toastify'
import { StyleSheetManager } from 'styled-components'

import { ErrorBoundary } from '../../components/ErrorBoundary'
import { sideWindowPaths } from '../../domain/entities/sideWindow'
import { ReportingContext } from '../../domain/shared_slices/Global'
import { MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES } from '../Mission/components/MissionForm/constants'
import { useListenMissionEventUpdates } from '../Mission/components/MissionForm/hooks/useListenMissionEventUpdates'
import { missionFormsActions } from '../Mission/components/MissionForm/slice'
import { MissionsNavBar } from '../Mission/MissionsNavBar'
import { Reportings } from '../Reportings'
import { BannerStack } from './components/BannerStack'
import { Route } from './Route'
import { sideWindowActions } from './slice'
import { StyledRouteContainer, Wrapper } from './style'

export function SideWindow() {
  const dispatch = useAppDispatch()
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const currentPath = useAppSelector(state => state.sideWindow.currentPath)
  const [isMounted, setIsMounted] = useState(false)
  const missionEvent = useListenMissionEventUpdates()
  const reportingEvent = useListenReportingEventUpdates()

  const missionCenteredControlUnitId = useAppSelector(state => state.missionForms.missionCenteredControlUnitId)

  const isMissionButtonIsActive = useMemo(() => isMissionOrMissionsPage(currentPath), [currentPath])
  const isReportingsButtonIsActive = useMemo(() => isReportingsPage(currentPath), [currentPath])
  const isDashboardsButtonIsActive = useMemo(
    () => isDashboardsPage(currentPath) || isDashboardPage(currentPath),
    [currentPath]
  )
  const isVigilanceAreasButtonIsActive = useMemo(() => currentPath === sideWindowPaths.VIGILANCE_AREAS, [currentPath])

  /**
   * Use to update mission opened in the side window but not actives
   */
  useEffect(() => {
    if (!missionEvent) {
      return
    }

    dispatch(missionFormsActions.updateUnactiveMission(omit(missionEvent, MISSION_EVENT_UNSYNCHRONIZED_PROPERTIES)))
  }, [dispatch, missionEvent])

  /**
   * Use to update reportings opened in the side window but not actives
   */
  useEffect(() => {
    if (!reportingEvent) {
      return
    }

    dispatch(reportingActions.updateUnactiveReporting(omit(reportingEvent, REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES)))
  }, [dispatch, reportingEvent])

  useEffect(() => {
    if (missionCenteredControlUnitId) {
      dispatch(missionFormsActions.setMissionCenteredControlUnitId())
    }
    const isCurrentPathIsMissionPage = isMissionPage(currentPath)
    if (!isCurrentPathIsMissionPage) {
      dispatch(missionFormsActions.resetActiveMissionId())
    }

    const isCurrentPathDashboard = isDashboardPage(currentPath)
    if (!isCurrentPathDashboard) {
      dispatch(dashboardActions.setActiveDashboardId(undefined))
    }
    // we don't want to run this effect on every missionCenteredControlUnitId change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath, dispatch])

  const navigate = (nextPath: string) => {
    if (!nextPath) {
      return
    }

    dispatch(sideWindowActions.removeBanners())

    const isCurrentPathIsMissionPage = isMissionPage(currentPath)
    if (isCurrentPathIsMissionPage) {
      dispatch(switchTab(nextPath))

      return
    }
    dispatch(sideWindowActions.setCurrentPath(nextPath))
  }

  const newWindowContextProviderValue: NewWindowContextValue = useMemo(
    () => ({
      newWindowContainerRef: wrapperRef.current
        ? (wrapperRef as MutableRefObject<HTMLDivElement>)
        : { current: window.document.createElement('div') }
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMounted]
  )

  useEffect(() => {
    setIsMounted(true)
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
                    title="Missions et contrôles"
                  />
                  <SideMenu.Button
                    Icon={Icon.Report}
                    isActive={isReportingsButtonIsActive}
                    onClick={() => navigate(generatePath(sideWindowPaths.REPORTINGS))}
                    title="Signalements"
                  />
                  <SideMenu.Button
                    Icon={Icon.VigilanceAreas}
                    isActive={isVigilanceAreasButtonIsActive}
                    onClick={() => navigate(generatePath(sideWindowPaths.VIGILANCE_AREAS))}
                    title="Zones de vigilance"
                  />

                  <SideMenu.Button
                    Icon={Icon.Bullseye}
                    isActive={isDashboardsButtonIsActive}
                    onClick={() => navigate(generatePath(sideWindowPaths.DASHBOARDS))}
                    title="Tableaux de bord"
                  />
                </SideMenu>

                <StyledRouteContainer>
                  <BannerStack />
                  <Route element={<ReportingsList />} path={sideWindowPaths.REPORTINGS} />
                  <Route element={<MissionsNavBar />} path={[sideWindowPaths.MISSIONS, sideWindowPaths.MISSION]} />
                  <Route element={<Missions />} path={sideWindowPaths.MISSIONS} />
                  <Route element={<MissionFormWrapper />} path={sideWindowPaths.MISSION} />
                  <Route element={<VigilancesAreasList />} path={sideWindowPaths.VIGILANCE_AREAS} />
                  <Route
                    element={<DashboardsNavBar />}
                    path={[sideWindowPaths.DASHBOARDS, sideWindowPaths.DASHBOARD]}
                  />
                  <Route element={<DashboardsList />} path={sideWindowPaths.DASHBOARDS} />
                  <Route element={<DashboardForms />} path={sideWindowPaths.DASHBOARD} />
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
