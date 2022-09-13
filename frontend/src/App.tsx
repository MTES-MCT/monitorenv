import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { CustomProvider } from 'rsuite';

import { homeStore } from './Store'
import { SideWindowTestContainer } from './features/side_window/SideWindowTestContainer';
import { AlertUnsupportedBrowser } from './components/AlertUnsupportedBrowser'
import { HomePage } from './pages/HomePage'
import { isBrowserSupported } from './utils/isBrowserSupported'

import { CYPRESS_TEST } from './env';

import frFR from './uiMonitor/locale_frFR'
import ErrorToastNotification from './components/ErrorToastNotification';

export const App = () => {
  if (!isBrowserSupported()) {
    return <AlertUnsupportedBrowser />
  }

  const persistor = persistStore(homeStore);
  return (
    <CustomProvider locale={frFR}>
      <Provider store={homeStore}>
        <PersistGate loading={null} persistor={persistor}>
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

            <ErrorToastNotification />
        </PersistGate>
      </Provider>
    </CustomProvider>
  )
}

