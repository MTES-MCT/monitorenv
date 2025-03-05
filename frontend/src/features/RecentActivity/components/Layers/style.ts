import { THEME } from '@mtes-mct/monitor-ui'

import type { FlatIcon } from 'ol/style/flat'

const featureHas = (key: string) => ['==', ['get', key], 1]

export const recentControlActivityStyle: FlatIcon = {
  'icon-color': [
    'case',
    featureHas('withDistinction'),
    ['case', featureHas('hasInfraction'), THEME.color.maximumRed, THEME.color.yellowGreen],
    THEME.color.charcoal
  ],
  'icon-scale': 0.6,
  'icon-src': 'Close.svg'
}
