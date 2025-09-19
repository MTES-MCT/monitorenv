import { Menu } from '@components/Menu'
import { MapFocusForDashboardBanner } from '@features/Dashboard/components/MapFocusForDashboardBanner'
import { useSearchLayers } from '@features/layersSelector/search/hooks/useSearchLayers'
import { BannerStack } from '@features/MainWindow/components/BannerStack'
import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { AttachMissionToReportingModal } from '@features/Reportings/components/ReportingForm/AttachMission/AttachMissionToReportingModal'
import { REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES } from '@features/Reportings/components/ReportingForm/constants'
import { useListenReportingEventUpdates } from '@features/Reportings/components/ReportingForm/hooks/useListenReportingEventUpdates'
import { reportingActions } from '@features/Reportings/slice'
import { SideWindowStatus } from '@features/SideWindow/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { shouldDisplayEnvBanner } from '@utils/shouldDisplayEnvBanner'
import { omit } from 'lodash-es'
import { useCallback, useEffect, useMemo } from 'react'
import { useBeforeUnload } from 'react-router'
import styled from 'styled-components'

import { ReportingContext } from '../domain/shared_slices/Global'
import { ControlUnitDialog } from '../features/ControlUnit/components/ControlUnitDialog'
import { Healthcheck } from '../features/healthcheck/Healthcheck'
import { LayersSidebar } from '../features/layersSelector'
import { LocateOnMap } from '../features/LocateOnMap'
import { Map } from '../features/map'
import { DrawModal } from '../features/map/draw/DrawModal'
import { RightMenuOnHoverArea } from '../features/map/shared/RightMenuOnHoverArea'
import { AttachReportingToMissionModal } from '../features/Mission/components/MissionForm/AttachReporting/AttachReportingToMissionModal'
import { Reportings } from '../features/Reportings'
import { SideWindowLauncher } from '../features/SideWindow/SideWindowLauncher'
import { useAppSelector } from '../hooks/useAppSelector'

import type { Environment } from 'types'

const environment = import.meta.env.FRONTEND_SENTRY_ENV as Environment

export function HomePage() {
  const dispatch = useAppDispatch()
  const bannerStack = useAppSelector(state => state.mainWindow.bannerStack)

  const isSuperUser = useAppSelector(state => state.account.isSuperUser)
  const sideWindowStatus = useAppSelector(state => state.sideWindow.status)

  const displayDrawModal = useAppSelector(state => state.global.menus.displayDrawModal)
  const displayLocateOnMap = useAppSelector(state => state.global.menus.displayLocateOnMap)

  const isControlUnitDialogVisible = useAppSelector(state => state.global.visibility.isControlUnitDialogVisible)

  const selectedMissions = useAppSelector(state => state.missionForms.missions)
  const reportings = useAppSelector(state => state.reporting.reportings)

  const dashboards = useAppSelector(state => state.dashboard.dashboards)

  const reportingEvent = useListenReportingEventUpdates()

  const dashboardMapFocus = useAppSelector(state => state.dashboard.mapFocus)

  const hasAtLeastOneMissionFormDirty = useMemo(
    () => Object.values(selectedMissions).some(mission => mission.isFormDirty),
    [selectedMissions]
  )

  const hasAtLeastOneReportingFormDirty = useMemo(
    () => Object.values(reportings).some(reporting => reporting.isFormDirty),
    [reportings]
  )

  const hasAtLeastOneDashboardFormDirty = useMemo(
    () => Object.values(dashboards).some(({ dashboard, unsavedDashboard }) => dashboard !== unsavedDashboard),
    [dashboards]
  )

  const beforeUnload = useCallback(
    event => {
      if (hasAtLeastOneMissionFormDirty || hasAtLeastOneReportingFormDirty || hasAtLeastOneDashboardFormDirty) {
        event.preventDefault()

        // eslint-disable-next-line no-return-assign, no-param-reassign
        return (event.returnValue = 'blocked')
      }

      return undefined
    },
    [hasAtLeastOneDashboardFormDirty, hasAtLeastOneMissionFormDirty, hasAtLeastOneReportingFormDirty]
  )

  useBeforeUnload(beforeUnload)

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
    if (environment === 'integration' || environment === 'preprod') {
      const bannerProps = shouldDisplayEnvBanner(bannerStack)

      if (!bannerProps) {
        return
      }
      dispatch(addMainWindowBanner(bannerProps))
    }
    // just want to run this once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useSearchLayers()

  return (
    <>
      {/* TODO Move this wrapper to `@features/MainWindow/components/MainWindowLayout.tsx`. */}
      {dashboardMapFocus && <MapFocusForDashboardBanner />}
      <Wrapper>
        <Healthcheck />
        <BannerStack />

        <Map />
        <LayersSidebar />
        <RightMenuOnHoverArea />
        {displayDrawModal && <DrawModal />}
        <AttachMissionToReportingModal />
        <AttachReportingToMissionModal />
        {displayLocateOnMap && <LocateOnMap />}
        {isControlUnitDialogVisible && isSuperUser && <ControlUnitDialog />}

        <Menu />

        <Reportings key="reportings-on-map" context={ReportingContext.MAP} />
      </Wrapper>

      {sideWindowStatus !== SideWindowStatus.CLOSED && <SideWindowLauncher />}
    </>
  )
}

const Wrapper = styled.div`
  font-size: 13px;
  overflow-y: hidden;
  overflow-x: hidden;
  width: 100%;
  position: relative;
`
