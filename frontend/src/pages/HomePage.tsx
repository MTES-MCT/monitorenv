import styled from 'styled-components'

import { APIWorker } from '../api/APIWorker'
import { ErrorToastNotification } from '../components/ErrorToastNotification'
import { FEATURE_FLAGS } from '../features'
import { DrawLayerModal } from '../features/drawLayer/DrawLayerModal'
import Healthcheck from '../features/healthcheck/Healthcheck'
import InterestPoint from '../features/interest_points/InterestPoint'
import { LayersSidebar } from '../features/layersSelector/LayersSidebar'
import { LocateOnMap } from '../features/locateOnMap/LocateOnMap'
import { Map } from '../features/map/Map'
import Measurement from '../features/measurements/Measurement'
import { MissionsMenu } from '../features/missions/MissionsMenu'
import SideWindowLauncher from '../features/side_window/SideWindowLauncher'
import { useAppSelector } from '../hooks/useAppSelector'

export function HomePage() {
  const {
    displayDrawLayerModal,
    displayInterestPoint,
    displayLayersSidebar,
    displayLocateOnMap,
    displayMeasurement,
    displayMissionsMenu
  } = useAppSelector(state => state.global)

  return (
    <>
      <Healthcheck />
      <Wrapper>
        <APIWorker />
        <Map />
        {displayLayersSidebar && <LayersSidebar />}
        {FEATURE_FLAGS.LOCALIZE_MISSIONS && displayDrawLayerModal && <DrawLayerModal />}
        {FEATURE_FLAGS.REPORTING && displayMissionsMenu && <MissionsMenu />}
        {displayMeasurement && <Measurement />}
        {displayLocateOnMap && <LocateOnMap />}
        {displayInterestPoint && <InterestPoint />}
        <ErrorToastNotification />
        {FEATURE_FLAGS.REPORTING && <SideWindowLauncher />}
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
