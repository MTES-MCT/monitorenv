import { useCallback, useMemo } from 'react'
import { useBeforeUnload } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'

import { APIWorker } from '../api/APIWorker'
import { ReportingContext } from '../domain/shared_slices/Global'
import { ControlUnitDialog } from '../features/ControlUnit/components/ControlUnitDialog'
import { Healthcheck } from '../features/healthcheck/Healthcheck'
import { LayersSidebar } from '../features/layersSelector'
import { LocateOnMap } from '../features/LocateOnMap'
import { ControlUnitListButton } from '../features/MainWindow/components/RightMenu/ControlUnitListButton'
import { Map } from '../features/map'
import { DrawModal } from '../features/map/draw/DrawModal'
import { RightMenuOnHoverArea } from '../features/map/shared/RightMenuOnHoverArea'
import { InterestPointMapButton } from '../features/map/tools/interestPoint/InterestPointMapButton'
import { MeasurementMapButton } from '../features/map/tools/measurements/MeasurementMapButton'
import { AttachReportingToMissionModal } from '../features/missions/MissionForm/AttachReporting/AttachReportingToMissionModal'
import { MissionsMenu } from '../features/missions/MissionsButton'
import { Reportings } from '../features/Reportings'
import { AttachMissionToReportingModal } from '../features/Reportings/ReportingForm/AttachMission/AttachMissionToReportingModal'
import { ReportingsButton } from '../features/Reportings/ReportingsButton'
import { SearchSemaphoreButton } from '../features/Semaphores/SearchSemaphoreButton'
import { SideWindowLauncher } from '../features/SideWindow/SideWindowLauncher'
import { useAppSelector } from '../hooks/useAppSelector'

export function HomePage() {
  const displayDrawModal = useAppSelector(state => state.global.displayDrawModal)
  const displayInterestPoint = useAppSelector(state => state.global.displayInterestPoint)
  const displayLocateOnMap = useAppSelector(state => state.global.displayLocateOnMap)
  const displayMeasurement = useAppSelector(state => state.global.displayMeasurement)
  const displayMissionMenuButton = useAppSelector(state => state.global.displayMissionMenuButton)
  const displayReportingsButton = useAppSelector(state => state.global.displayReportingsButton)
  const isRightMenuControlUnitListButtonVisible = useAppSelector(
    state => state.global.displayRightMenuControlUnitListButton
  )
  const displaySearchSemaphoreButton = useAppSelector(state => state.global.displaySearchSemaphoreButton)
  const isControlUnitDialogVisible = useAppSelector(state => state.global.isControlUnitDialogVisible)

  const selectedMissions = useAppSelector(state => state.missionForms.missions)
  const reportings = useAppSelector(state => state.reporting.reportings)

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

  return (
    <>
      <Healthcheck />
      <Wrapper>
        <APIWorker />
        <Map />
        <LayersSidebar />
        <RightMenuOnHoverArea />
        {displayDrawModal && <DrawModal />}
        <AttachMissionToReportingModal />
        <AttachReportingToMissionModal />
        {displayLocateOnMap && <LocateOnMap />}
        {isControlUnitDialogVisible && <ControlUnitDialog />}

        {displayMissionMenuButton && <MissionsMenu />}
        {displayReportingsButton && <ReportingsButton />}
        {displaySearchSemaphoreButton && <SearchSemaphoreButton />}
        {isRightMenuControlUnitListButtonVisible && <ControlUnitListButton />}

        {displayMeasurement && <MeasurementMapButton />}
        {displayInterestPoint && <InterestPointMapButton />}

        <Reportings key="reportings-on-map" context={ReportingContext.MAP} />

        <SideWindowLauncher />

        <ToastContainer containerId="map" enableMultiContainer />
      </Wrapper>
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
