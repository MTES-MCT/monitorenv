import { THEME, ThemeProvider, OnlyFontGlobalStyle } from '@mtes-mct/monitor-ui'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { CustomProvider } from 'rsuite'

import { AlertUnsupportedBrowser } from './components/AlertUnsupportedBrowser'
import { ToastNotification } from './components/ToastNotification'
import { SideWindow } from './features/SideWindow'
import { BackOfficePage } from './pages/BackOfficePage'
import { HomePage } from './pages/HomePage'
import { homeStore } from './store'
import frFR from './uiMonitor/locale_frFR'
import { isBrowserSupported } from './utils/isBrowserSupported'

export function App() {
  if (!isBrowserSupported()) {
    return <AlertUnsupportedBrowser />
  }

  // expose store when run in Cypress
  if (window.Cypress) {
    window.store = homeStore
  }

  const persistor = persistStore(homeStore)

  return (
    <ThemeProvider theme={THEME}>
      <OnlyFontGlobalStyle />
      <CustomProvider disableRipple locale={frFR}>
        <Provider store={homeStore}>
          <PersistGate loading={undefined} persistor={persistor}>
            <Router>
              <Routes>
                <Route element={<BackOfficePage />} path="/backoffice/*" />
                <Route element={<SideWindow />} path="/side_window" />
                <Route element={<HomePage />} path="/" />
              </Routes>
            </Router>

            <ToastNotification />
          </PersistGate>
        </Provider>
      </CustomProvider>
    </ThemeProvider>
  )
}
