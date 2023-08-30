import { useCallback, useMemo } from 'react'
import { useBeforeUnload } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'

import { APIWorker } from '../api/APIWorker'
import Healthcheck from '../features/healthcheck/Healthcheck'
import { LayersSidebar } from '../features/layersSelector'
import { LocateOnMap } from '../features/LocateOnMap'
import { Map } from '../features/map'
import { DrawModal } from '../features/map/draw/DrawModal'
import { RightMenuOnHoverArea } from '../features/map/shared/RightMenuOnHoverArea'
import { InterestPointMapButton } from '../features/map/tools/interest_points/InterestPointMapButton'
import { MeasurementMapButton } from '../features/map/tools/measurements/MeasurementMapButton'
import { MissionsMenu } from '../features/missions/MissionsButton'
import { Reportings } from '../features/Reportings'
import { ReportingsButton } from '../features/Reportings/ReportingsButton'
import { SearchSemaphoreButton } from '../features/Semaphores/SearchSemaphoreButton'
import { SideWindowLauncher } from '../features/SideWindow/SideWindowLauncher'
import { useAppSelector } from '../hooks/useAppSelector'

export function HomePage() {
  const {
    displayDrawModal,
    displayInterestPoint,
    displayLocateOnMap,
    displayMeasurement,
    displayMissionMenuButton,
    displayReportingsButton,
    displaySearchSemaphoreButton
  } = useAppSelector(state => state.global)
  const {
    missionState: { isFormDirty, missionState },
    multiMissions: { selectedMissions }
  } = useAppSelector(state => state)

  const hasAtLeastOneMissionFormDirty = useMemo(
    () => selectedMissions.find(mission => mission.isFormDirty),
    [selectedMissions]
  )
  const beforeUnload = useCallback(
    event => {
      if ((isFormDirty && missionState) || hasAtLeastOneMissionFormDirty) {
        event.preventDefault()

        // eslint-disable-next-line no-return-assign, no-param-reassign
        return (event.returnValue = 'blocked')
      }

      return undefined
    },
    [hasAtLeastOneMissionFormDirty, isFormDirty, missionState]
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
        {displayLocateOnMap && <LocateOnMap />}

        {displayMissionMenuButton && <MissionsMenu />}
        {displayReportingsButton && <ReportingsButton />}
        {displaySearchSemaphoreButton && <SearchSemaphoreButton />}

        {displayMeasurement && <MeasurementMapButton />}
        {displayInterestPoint && <InterestPointMapButton />}

        <Reportings />

        <SideWindowLauncher />

        <ToastContainer containerId="default" enableMultiContainer />
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
