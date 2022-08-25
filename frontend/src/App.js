import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { browserName, browserVersion } from 'react-device-detect'
import { CustomProvider } from 'rsuite';
import { ToastProvider } from 'react-toast-notifications'

import { homeStore } from './Store'
import { SideWindowTestContainer } from './features/side_window/SideWindowTestContainer';
import { AlertUnsupportedBrowser } from './components/AlertUnsupportedBrowser'
import { HomePage } from './pages/HomePage'

import { CYPRESS_TEST } from './env';

import frFR from './uiMonitor/locale_frFR'

const App = () => {
  switch (browserName) {
    case 'Internet Explorer':
      return AlertUnsupportedBrowser()
    case 'Edge':
      if (browserVersion < 79) return AlertUnsupportedBrowser()
      break
    case 'Chrome':
      if (browserVersion < 69) return AlertUnsupportedBrowser()
      break
    case 'Firefox':
      if (browserVersion < 62) return AlertUnsupportedBrowser()
      break
    case 'Safari':
      if (browserVersion < 12) return AlertUnsupportedBrowser()
      break
    case 'Opera':
      if (browserVersion < 56) return AlertUnsupportedBrowser()
      break
  }


  const persistor = persistStore(homeStore);
  return (
    <CustomProvider locale={frFR}>
      <Provider store={homeStore}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastProvider placement="bottom-right">
            <Router>
              <Switch>
                {
                // UNSAFE : CYPRESS_TEST is overridable on the client
                CYPRESS_TEST==='true' && 
                  <Route exact path="/side_window">
                    <SideWindowTestContainer />
                  </Route>
                }
                <Route path="/">
                  <HomePage />
                </Route>
              </Switch>
            </Router>
          </ToastProvider>
        </PersistGate>
      </Provider>
    </CustomProvider>
  )
}

export default App
