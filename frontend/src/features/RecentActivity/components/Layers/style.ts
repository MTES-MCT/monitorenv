import { THEME } from '@mtes-mct/monitor-ui'

import type { FlatStyleLike } from 'ol/style/flat'

export const stateIs = (key: string) => ['==', ['var', key], 1]
export const recentControlActivityStyle: FlatStyleLike = [
  {
    filter: ['==', ['var', 'drawedGeometryId'], ['id']],
    style: {
      'stroke-color': THEME.color.slateGray,
      'stroke-line-dash': [4, 4],
      'stroke-width': 2
    }
  },
  {
    else: true,
    style: {
      'icon-color': [
        'interpolate',
        ['linear'],
        ['get', 'ratioInfractionsInControls'],
        0,
        '#87C20D',
        6,
        '#FAC200',
        11,
        '#E79000',
        26,
        '#CE6000',
        51,
        '#AF2E12',
        76,
        '#8C0D3A',
        91,
        '#810030',
        100,
        '#810030'
      ],
      'icon-scale': ['interpolate', ['linear'], ['get', 'ratioTotalControls'], 0, 0.1, 100, 1],
      'icon-src': 'icons/dot.svg'
    }
  }
]
