import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import APIWorker from '../api/APIWorker'
import SideWindowLauncher from '../features/side_window/SideWindowLauncher'
import Healthcheck from '../features/healthcheck/Healthcheck'
import ErrorToastNotification from '../features/commonComponents/ErrorToastNotification'
import Map from '../features/map/Map'
import LayersSidebar from '../features/layers/LayersSidebar'
import { MissionsMenu } from '../features/missions/MissionsMenu'
import Measurement from '../features/measurements/Measurement'
import InterestPoint from '../features/interest_points/InterestPoint'
import { LocateOnMap } from '../features/locateOnMap/LocateOnMap';
import { DrawLayerModal } from '../features/drawLayer/DrawLayerModal';

import { FEATURE_FLAGS } from '../features';




export const HomePage = () => {
  const { 
    displayLayersSidebar,
    displayMissionsMenu,
    displayMeasurement,
    displayLocateOnMap,
    displayInterestPoint,
    displayDrawLayerModal
   } = useSelector(state => state.global)
  return (<>
      <Healthcheck/>
      <Wrapper>
        <APIWorker/>
        <Map/>
        {displayLayersSidebar && <LayersSidebar/> }
        {FEATURE_FLAGS.LOCALIZE_MISSIONS && displayDrawLayerModal && <DrawLayerModal/>}
        {FEATURE_FLAGS.REPORTING && displayMissionsMenu && <MissionsMenu />}
        {displayMeasurement && <Measurement/>}
        {displayLocateOnMap && <LocateOnMap />}
        {displayInterestPoint && <InterestPoint/>}
        {/* <APIWorker/> */}
        <ErrorToastNotification/>
        {FEATURE_FLAGS.REPORTING && <SideWindowLauncher/> }
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
