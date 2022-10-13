import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { CustomProvider } from 'rsuite'

import { AlertUnsupportedBrowser } from './components/AlertUnsupportedBrowser'
import { ErrorToastNotification } from './components/ErrorToastNotification'
import { CYPRESS_TEST } from './env'
import { SideWindowTestContainer } from './features/side_window/SideWindowTestContainer'
import { HomePage } from './pages/HomePage'
import { homeStore } from './Store'
import frFR from './uiMonitor/locale_frFR'
import { isBrowserSupported } from './utils/isBrowserSupported'

export function App() {
  if (!isBrowserSupported()) {
    return <AlertUnsupportedBrowser />
  }

  const persistor = persistStore(homeStore)

  return (
    <CustomProvider locale={frFR}>
      <Provider store={homeStore}>
        <PersistGate loading={undefined} persistor={persistor}>
          <Router>
            <Switch>
              {
                // UNSAFE : CYPRESS_TEST is overridable on the client
                CYPRESS_TEST === 'true' && (
                  <Route exact path="/side_window">
                    <SideWindowTestContainer />
                  </Route>
                )
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
