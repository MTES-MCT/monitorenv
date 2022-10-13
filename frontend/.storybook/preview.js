import 'rsuite/dist/rsuite.min.css'
import 'ol/ol.css'

import '../src/index.css'
import '../src/App.css'
import '../src/uiMonitor/ol-override.css'
import '../src/uiMonitor/rsuite-override.css'

import './storybook.css'
import { GlobalStyle } from '../src/fonts/fonts'

export const decorators = [
  Story => (
    <>
      <GlobalStyle />
      <Story />
    </>
  )
]
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  
}