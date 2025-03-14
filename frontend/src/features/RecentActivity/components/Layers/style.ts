import { THEME } from '@mtes-mct/monitor-ui'

import type { FlatStyleLike } from 'ol/style/flat'

const featureHas = (key: string) => ['==', ['get', key], 1]

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
    filter: ['!', stateIs('withDistinction')],
    style: {
      'icon-color': [
        'interpolate',
        ['linear'],
        ['get', 'totalControls'],
        0,
        '#FFFF33',
        1,
        '#FFC300',
        5,
        '#EF9100',
        10,
        '#D6610A',
        15,
        '#B72F15',
        20,
        '#880030'
      ],
      'icon-scale': 0.6,
      'icon-src': 'icons/dot.svg'
    }
  },
  {
    filter: ['all', stateIs('withDistinction'), ['!', !featureHas('withInfractions')]],
    style: {
      'icon-color': [
        'interpolate',
        ['linear'],
        ['get', 'totalControlsWithoutInfractions'],
        0,
        '#FFFF33',
        1,
        '#FFC300',
        5,
        '#EF9100',
        10,
        '#D6610A',
        15,
        '#B72F15',
        20,
        '#880030'
      ],
      'icon-scale': 0.6,
      'icon-src': 'icons/dot.svg'
    }
  },
  {
    filter: ['all', stateIs('withDistinction'), featureHas('withInfractions')],
    style: {
      'icon-color': [
        'interpolate',
        ['linear'],
        ['get', 'totalControlsWithInfractions'],
        0,
        '#FFFF33',
        1,
        '#FFC300',
        5,
        '#EF9100',
        10,
        '#D6610A',
        15,
        '#B72F15',
        20,
        '#880030'
      ],
      'icon-displacement': [-10, 0],
      'icon-scale': 0.7,
      'icon-src': 'icons/dot_with_cross.svg'
    }
  }
]
