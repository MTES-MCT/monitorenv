import { Menu } from '@components/Menu'
import { BannerStack } from '@features/MainWindow/components/BannerStack'
import { AttachMissionToReportingModal } from '@features/Reportings/components/ReportingForm/AttachMission/AttachMissionToReportingModal'
import { REPORTING_EVENT_UNSYNCHRONIZED_PROPERTIES } from '@features/Reportings/components/ReportingForm/constants'
import { useListenReportingEventUpdates } from '@features/Reportings/components/ReportingForm/hooks/useListenReportingEventUpdates'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { reportingActions } from 'domain/shared_slices/reporting'
import { omit } from 'lodash'
import { useCallback, useEffect, useMemo } from 'react'
import { useBeforeUnload } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'

import { ReportingContext } from '../domain/shared_slices/Global'
import { ControlUnitDialog } from '../features/ControlUnit/components/ControlUnitDialog'
import { Healthcheck } from '../features/healthcheck/Healthcheck'
import { LayersSidebar } from '../features/layersSelector'
import { LocateOnMap } from '../features/LocateOnMap'
import { Map } from '../features/map'
import { DrawModal } from '../features/map/draw/DrawModal'
import { RightMenuOnHoverArea } from '../features/map/shared/RightMenuOnHoverArea'
import { AttachReportingToMissionModal } from '../features/missions/MissionForm/AttachReporting/AttachReportingToMissionModal'
import { Reportings } from '../features/Reportings'
import { SideWindowLauncher } from '../features/SideWindow/SideWindowLauncher'
import { useAppSelector } from '../hooks/useAppSelector'

export function HomePage() {
  const dispatch = useAppDispatch()

  const { data: user } = useGetCurrentUserAuthorizationQueryOverride()

  const isSuperUser = useMemo(() => user?.isSuperUser, [user])

  const displayDrawModal = useAppSelector(state => state.global.displayDrawModal)
  const displayLocateOnMap = useAppSelector(state => state.global.displayLocateOnMap)

  const isControlUnitDialogVisible = useAppSelector(state => state.global.isControlUnitDialogVisible)

  const selectedMissions = useAppSelector(state => state.missionForms.missions)
  const reportings = useAppSelector(state => state.reporting.reportings)

  const reportingEvent = useListenReportingEventUpdates()

  const hasAtLeastOneMissionFormDirty = useMemo(
    () => !!Object.values(selectedMissions).find(mission => mission.isFormDirty),
    [selectedMissions]
  )

  const hasAtLeastOneReportingFormDirty = useMemo(
    () => !!Object.values(reportings).find(reporting => reporting.isFormDirty),
    [reportings]
  )

  const beforeUnload = useCallback(
    event => {
      if (hasAtLeastOneMissionFormDirty || hasAtLeastOneReportingFormDirty) {
        event.preventDefault()

        // eslint-disable-next-line no-return-assign, no-param-reassign
        return (event.returnValue = 'blocked')
      }

      return undefined
    },
    [hasAtLeastOneMissionFormDirty, hasAtLeastOneReportingFormDirty]
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

  return (
    <>
      {/* TODO Move this wrapper to `@features/MainWindow/components/MainWindowLayout.tsx`. */}
      <Wrapper>
        <Healthcheck />
        <BannerStack />

        <Map isSuperUser={isSuperUser} />
        <LayersSidebar isSuperUser={isSuperUser ?? false} />
        <RightMenuOnHoverArea />
        {displayDrawModal && <DrawModal />}
        <AttachMissionToReportingModal />
        <AttachReportingToMissionModal />
        {displayLocateOnMap && <LocateOnMap />}
        {isControlUnitDialogVisible && isSuperUser && <ControlUnitDialog />}

        <Menu isSuperUser={isSuperUser} />

        <Reportings key="reportings-on-map" context={ReportingContext.MAP} />

        <ToastContainer containerId="map" />
      </Wrapper>

      <SideWindowLauncher />
    </>
  )
}

const Wrapper = styled.div`
  font-size: 13px;
  height: 100% - 50px;
  width: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
`
