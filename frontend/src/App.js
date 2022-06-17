import React from 'react'
import { browserName, browserVersion } from 'react-device-detect'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ToastProvider } from 'react-toast-notifications'
import { CustomProvider } from 'rsuite';

import { AlertUnsupportedBrowser } from './features/commonComponents/AlertUnsupportedBrowser'
import { HomePage } from './pages/HomePage'

import frFR from './features/commonComponents/locale_frFR'

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

  return (
    <CustomProvider locale={frFR}>
      <ToastProvider placement="bottom-right">
        <Router>
          <Switch>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </ToastProvider>
    </CustomProvider>
  )
}

export default App
