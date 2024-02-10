import { AlertUnsupportedBrowser } from '@components/AlertUnsupportedBrowser'
import { ToastNotification } from '@components/ToastNotification'
import { SideWindow } from '@features/SideWindow'
import { THEME, ThemeProvider, OnlyFontGlobalStyle } from '@mtes-mct/monitor-ui'
import { BackOfficePage } from '@pages/BackOfficePage'
import { HomePage } from '@pages/HomePage'
import { homeStore } from '@store/index'
import { isBrowserSupported } from '@utils/isBrowserSupported'
import { isCypress } from '@utils/isCypress'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { CustomProvider as RsuiteCustomProvider } from 'rsuite'

import { FR_FR_LOCALE } from './uiMonitor/locale_frFR'

export function App() {
  if (!isBrowserSupported()) {
    return <AlertUnsupportedBrowser />
  }

  // Expose store when run in Cypress
  if (isCypress()) {
    window.store = homeStore
  }

  const persistor = persistStore(homeStore)

  return (
    <ThemeProvider theme={THEME}>
      <OnlyFontGlobalStyle />
      <RsuiteCustomProvider disableRipple locale={FR_FR_LOCALE}>
        <ReduxProvider store={homeStore}>
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
        </ReduxProvider>
      </RsuiteCustomProvider>
    </ThemeProvider>
  )
}
