import { THEME } from '@mtes-mct/monitor-ui'

import type { FlatStyleLike } from 'ol/style/flat'

const featureHas = (key: string) => ['==', ['get', key], 1]

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
        'case',
        featureHas('withDistinction'),
        ['case', featureHas('hasInfraction'), THEME.color.maximumRed, THEME.color.yellowGreen],
        [
          'interpolate',
          ['linear'],
          ['get', 'totalControls'],
          0,
          '#FFC300',
          5,
          '#EF9100',
          10,
          '#D6610A',
          15,
          '#B72F15',
          20,
          '#880030'
        ]
      ],
      'icon-scale': 0.6,
      'icon-src': 'icons/CircleFilled.svg'
    }
  }
]
