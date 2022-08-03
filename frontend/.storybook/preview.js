import 'rsuite/dist/rsuite.min.css'
import 'ol/ol.css'

import '../src/index.css';
import '../src/App.css';
import '../src/ol-override.css'
import '../src/rsuite-override.css'

import './storybook.css';


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}