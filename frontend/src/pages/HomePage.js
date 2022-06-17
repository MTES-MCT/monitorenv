import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

import styled from 'styled-components'

import { NamespaceContext } from '../domain/context/NamespaceContext'
import { homeStore } from './../Store'

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
import { SideWindowTestContainer } from '../features/side_window/SideWindowTestContainer';

import { CYPRESS_TEST } from '../env';

const FEATURE_FLAG_REPORTING = true

const persistor = persistStore(homeStore);

export const HomePage = () => {
  return <Provider store={homeStore}>
    <PersistGate loading={null} persistor={persistor}>
      <NamespaceContext.Provider value={'homepage'}>
        <Switch>
          {
          // UNSAFE : CYPRESS_TEST is overridable on the client
          CYPRESS_TEST==='true' && 
            <Route exact path="/side_window">
              <SideWindowTestContainer />
            </Route>
          }
          <Route exact path="/">
            <Healthcheck/>
            <Wrapper>
              <APIWorker/>
              <Map/>
              <LayersSidebar/> 
              {FEATURE_FLAG_REPORTING && <MissionsMenu />}
              <Measurement/>
              <LocateOnMap />
              <InterestPoint/>
              {/* <APIWorker/> */}
              <ErrorToastNotification/>
              {FEATURE_FLAG_REPORTING && <SideWindowLauncher/> }
            </Wrapper>
          </Route>
        </Switch>
      </NamespaceContext.Provider>
    </PersistGate>
  </Provider>
}

const Wrapper = styled.div`
  font-size: 13px;
  text-align: center;
  height: 100% - 50px;
  width: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  `
