import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

import styled from 'styled-components'

import { NamespaceContext } from '../domain/context/NamespaceContext'
import { homeStore } from './../Store'

import SideWindow from '../features/side_window/SideWindow'
import SideWindowLauncher from '../features/side_window/SideWindowLauncher'
import Healthcheck from '../features/healthcheck/Healthcheck'
// import ErrorToastNotification from '../features/commonComponents/ErrorToastNotification'
import Map from '../features/map/Map'
import APIWorker from '../api/APIWorker'
import LayersSidebar from '../features/layers/LayersSidebar'
import OperationsMapButton from '../features/side_window/operations/OperationsMapButton'
import Measurement from '../features/measurements/Measurement'
import InterestPoint from '../features/interest_points/InterestPoint'

const persistor = persistStore(homeStore);

export const HomePage = () => {
  return <Provider store={homeStore}>
    <PersistGate loading={null} persistor={persistor}>
      <NamespaceContext.Provider value={'homepage'}>
        <Switch>
        <Route exact path="/side_window">
            <SideWindow />
          </Route>
          <Route exact path="/">
            <Healthcheck/>
            <Wrapper>
              <APIWorker/>
              <Map/>
              <LayersSidebar/> 
              <OperationsMapButton />
              <Measurement/>
              <InterestPoint/>
              {/* <APIWorker/> */}
              {/* <ErrorToastNotification/> */}
              <SideWindowLauncher/>
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
