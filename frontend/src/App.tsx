import { THEME, ThemeProvider, OnlyFontGlobalStyle } from '@mtes-mct/monitor-ui'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { CustomProvider } from 'rsuite'

import { AlertUnsupportedBrowser } from './components/AlertUnsupportedBrowser'
import { ErrorToastNotification } from './components/ErrorToastNotification'
import { SideWindow } from './features/SideWindow'
import { HomePage } from './pages/HomePage'
import { homeStore } from './store'
import frFR from './uiMonitor/locale_frFR'
import { isBrowserSupported } from './utils/isBrowserSupported'

export function App() {
  if (!isBrowserSupported()) {
    return <AlertUnsupportedBrowser />
  }

  const persistor = persistStore(homeStore)

  return (
    <ThemeProvider theme={THEME}>
      <OnlyFontGlobalStyle />
      <CustomProvider locale={frFR}>
        <Provider store={homeStore}>
          <PersistGate loading={undefined} persistor={persistor}>
            <Router>
              <Routes>
                <Route element={<SideWindow />} path="/side_window" />
                <Route element={<HomePage />} path="/" />
              </Routes>
            </Router>

            <ErrorToastNotification />
          </PersistGate>
        </Provider>
      </CustomProvider>
    </ThemeProvider>
  )
}
