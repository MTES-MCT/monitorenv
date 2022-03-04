import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import styled from 'styled-components'

import { NamespaceContext } from '../domain/context/NamespaceContext'
import { homeStore } from './../Store'

import Healthcheck from '../features/healthcheck/Healthcheck'
// import ErrorToastNotification from '../features/commonComponents/ErrorToastNotification'
import Map from '../features/map/Map'
import APIWorker from '../api/APIWorker'
import LayersSidebar from '../features/layers/LayersSidebar'
// import Measurement from '../features/measurements/Measurement'
// import InterestPoint from '../features/interest_points/InterestPoint'



export const HomePage = () => {
  return <Provider store={homeStore}>
    <NamespaceContext.Provider value={'homepage'}>
      <Switch>
        <Route exact path="/">
          <Healthcheck/>
          <Wrapper>
            <APIWorker/>
            <Map/>
            <LayersSidebar/> 
            {/* <Measurement/>
            <InterestPoint/> */}
            {/* <APIWorker/> */}
            {/* <ErrorToastNotification/> */}
          </Wrapper>
        </Route>
      </Switch>
    </NamespaceContext.Provider>
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
