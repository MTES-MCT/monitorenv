import styled from 'styled-components'

import { APIWorker } from '../api/APIWorker'
import { ErrorToastNotification } from '../components/ErrorToastNotification'
import Healthcheck from '../features/healthcheck/Healthcheck'
import { LayersSidebar } from '../features/layersSelector/LayersSidebar'
import { LocateOnMap } from '../features/LocateOnMap'
import { DrawModal } from '../features/map/draw/DrawModal'
import { Map } from '../features/map/Map'
import { InterestPointMapButton } from '../features/map/tools/interest_points/InterestPointMapButton'
import { MeasurementMapButton } from '../features/map/tools/measurements/MeasurementMapButton'
import { MissionsMenu } from '../features/missions/MissionsMenu'
import { SemaphoresOnMap } from '../features/Semaphores/SemaphoresOnMap'
import { SideWindowLauncher } from '../features/SideWindow/SideWindowLauncher'
import { useAppSelector } from '../hooks/useAppSelector'

export function HomePage() {
  const {
    displayDrawModal,
    displayInterestPoint,
    displayLocateOnMap,
    displayMeasurement,
    displayMissionMenuButton,
    displaySemaphoreButton
  } = useAppSelector(state => state.global)

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
        {displaySemaphoreButton && <SemaphoresOnMap />}

        {displayMeasurement && <MeasurementMapButton />}
        {displayInterestPoint && <InterestPointMapButton />}

        <SideWindowLauncher />

        <ErrorToastNotification />
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
