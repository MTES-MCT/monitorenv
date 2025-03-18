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
        5,
        '#FAC200',
        25,
        '#E79000',
        37,
        '#CE6000',
        50,
        '#AF2E12',
        90,
        '#480135',
        100,
        '#480135'
      ],
      'icon-scale': ['interpolate', ['linear'], ['get', 'ratioTotalControls'], 0, 0.05, 100, 1],
      'icon-src': 'icons/dot.svg'
    }
  }
]
