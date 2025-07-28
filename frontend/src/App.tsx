import { AlertUnsupportedBrowser } from '@components/AlertUnsupportedBrowser'
import { CustomGlobalStyle } from '@components/CustomGlobalStyle'
import { ErrorBoundary } from '@components/ErrorBoundary'
import { RequireAuth } from '@components/RequireAuth'
import { SideWindow } from '@features/SideWindow'
import { useMatomo } from '@hooks/useMatomo'
import { OnlyFontGlobalStyle, THEME, ThemeProvider } from '@mtes-mct/monitor-ui'
import { BackOfficePage } from '@pages/BackOfficePage'
import { HomePage } from '@pages/HomePage'
import { Login } from '@pages/Login'
import { Register } from '@pages/Register'
import { homeStore } from '@store/index'
import { isBrowserSupported } from '@utils/isBrowserSupported'
import { isCypress } from '@utils/isCypress'
import { MissionEventProvider } from 'context/mission/MissionEventContext'
import { ReportingEventProvider } from 'context/reporting/ReportingEventContext'
import { paths } from 'paths'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { CustomProvider as RsuiteCustomProvider } from 'rsuite'
import frFR from 'rsuite/locales/fr_FR'

export function App() {
  useMatomo()
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
      <CustomGlobalStyle />

      <RsuiteCustomProvider disableRipple locale={frFR}>
        <ErrorBoundary>
          <ReduxProvider store={homeStore}>
            <PersistGate loading={undefined} persistor={persistor}>
              <MissionEventProvider>
                <ReportingEventProvider>
                  <BrowserRouter>
                    <Routes>
                      <Route element={<Login />} path={paths.login} />

                      <Route element={<Register />} path={paths.register} />

                      <Route
                        element={
                          <RequireAuth redirect requireSuperUser>
                            <BackOfficePage />
                          </RequireAuth>
                        }
                        path={`${paths.backoffice}/*`}
                      />

                      <Route
                        element={
                          <RequireAuth redirect requireSuperUser>
                            <SideWindow />
                          </RequireAuth>
                        }
                        path={paths.sidewindow}
                      />

                      <Route
                        element={
                          <RequireAuth redirect>
                            <HomePage />
                          </RequireAuth>
                        }
                        path={paths.ext}
                      />

                      <Route
                        element={
                          <RequireAuth redirect>
                            <HomePage />
                          </RequireAuth>
                        }
                        path={paths.home}
                      />
                    </Routes>
                  </BrowserRouter>
                </ReportingEventProvider>
              </MissionEventProvider>
            </PersistGate>
          </ReduxProvider>
        </ErrorBoundary>
      </RsuiteCustomProvider>
    </ThemeProvider>
  )
}
