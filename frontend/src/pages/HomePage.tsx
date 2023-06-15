import { useCallback } from 'react'
import { useBeforeUnload } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'

import { APIWorker } from '../api/APIWorker'
import Healthcheck from '../features/healthcheck/Healthcheck'
import { LayersSidebar } from '../features/layersSelector/LayersSidebar'
import { LocateOnMap } from '../features/LocateOnMap'
import { DrawModal } from '../features/map/draw/DrawModal'
import { Map } from '../features/map/Map'
import { InterestPointMapButton } from '../features/map/tools/interest_points/InterestPointMapButton'
import { MeasurementMapButton } from '../features/map/tools/measurements/MeasurementMapButton'
import { MissionsMenu } from '../features/missions/MissionsMenu'
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
    displaySearchSemaphoreButton
  } = useAppSelector(state => state.global)
  const { isFormDirty, missionState } = useAppSelector(state => state.missionState)

  const beforeUnload = useCallback(
    event => {
      if (isFormDirty && missionState) {
        event.preventDefault()

        // eslint-disable-next-line no-return-assign, no-param-reassign
        return (event.returnValue = 'blocked')
      }

      return undefined
    },
    [isFormDirty, missionState]
  )

  useBeforeUnload(beforeUnload)

  return (
    <>
      <Healthcheck />
      <Wrapper>
        <APIWorker />
        <Map />
        <LayersSidebar />
        {displayDrawModal && <DrawModal />}
        {displayLocateOnMap && <LocateOnMap />}

        {displayMissionMenuButton && <MissionsMenu />}
        {displaySearchSemaphoreButton && <SearchSemaphoreButton />}

        {displayMeasurement && <MeasurementMapButton />}
        {displayInterestPoint && <InterestPointMapButton />}

        <SideWindowLauncher />

        <ToastContainer containerId="default" enableMultiContainer />
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
  font-size: 13px;
  text-align: center;
  height: 100% - 50px;
  width: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
`
