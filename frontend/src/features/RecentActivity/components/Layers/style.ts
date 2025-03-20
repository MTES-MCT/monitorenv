// import { THEME } from '@mtes-mct/monitor-ui'
import { Icon, Style } from 'ol/style'

// import type { FlatStyleLike } from 'ol/style/flat'

export const stateIs = (key: string) => ['==', ['var', key], 1]
/* export const recentControlActivityStyle: FlatStyleLike = [
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
        [135, 194, 13], // '#87C20D',
        6,
        [250, 194, 0], // '#FAC200',
        11,
        [231, 144, 0], // '#E79000',
        26,
        [206, 96, 0], // '#CE6000',
        51,
        [175, 46, 18], // '#AF2E12',
        76,
        [140, 13, 58], // '#8C0D3A',
        91,
        [129, 0, 48], // '#810030',
        100,
        [129, 0, 48] // '#810030'
      ],
      'icon-scale': ['interpolate', ['linear'], ['get', 'ratioTotalControls'], 0, 0.1, 100, 1],
      'icon-src': 'icons/dot.svg'
    }
  }
] */

const getIconColor = (ratioInfractionsInControls: number) => {
  if (ratioInfractionsInControls < 6) {
    return '#87C20D'
  }
  if (ratioInfractionsInControls < 11) {
    return '#FAC200'
  }
  if (ratioInfractionsInControls < 26) {
    return '#E79000'
  }
  if (ratioInfractionsInControls < 51) {
    return '#AF2E12'
  }
  if (ratioInfractionsInControls < 76) {
    return '#8C0D3A'
  }
  if (ratioInfractionsInControls < 91) {
    return '#810030'
  }

  return '#810030' // Default
}

export const recentControlActivityStyle = feature =>
  new Style({
    image: new Icon({
      color: getIconColor(feature.get('ratioInfractionsInControls')),
      scale: Math.max(0.1, Math.min(1, feature.get('ratioTotalControls') / 100)),
      src: 'icons/dot.svg'
    })
  })
