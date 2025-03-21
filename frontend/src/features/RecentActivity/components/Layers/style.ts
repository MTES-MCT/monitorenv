import { RecentActivity } from '@features/RecentActivity/types'
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
        RecentActivity.CONTROLS_COLORS[0],
        6,
        RecentActivity.CONTROLS_COLORS[1],
        11,
        RecentActivity.CONTROLS_COLORS[2],
        26,
        RecentActivity.CONTROLS_COLORS[3],
        51,
        RecentActivity.CONTROLS_COLORS[4],
        76,
        RecentActivity.CONTROLS_COLORS[5],
        91,
        RecentActivity.CONTROLS_COLORS[6],
        100,
        RecentActivity.CONTROLS_COLORS[6]
      ],
      'icon-scale': ['interpolate', ['linear'], ['get', 'ratioTotalControls'], 0, 0.1, 100, 1],
      'icon-src': 'icons/dot.svg'
    }
  }
]
