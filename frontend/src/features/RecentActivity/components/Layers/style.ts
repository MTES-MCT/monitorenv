import { overlayStroke } from '@features/map/overlays/style'
import { THEME } from '@mtes-mct/monitor-ui'
import { Layers } from 'domain/entities/layers/constants'
import { Icon, Stroke, Style } from 'ol/style'

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

export const recentControlActivityStyle = feature => {
  if (feature.getId() === `${Layers.RECENT_CONTROLS_ACTIVITY.code}:DRAWED_GEOMETRY`) {
    return new Style({
      stroke: new Stroke({
        color: THEME.color.slateGray,
        lineDash: [4, 4],
        width: 2
      })
    })
  }

  const iconSize = feature.get('iconSize')

  return [
    new Style({
      image: new Icon({
        color: getIconColor(feature.get('ratioInfractionsInControls')),
        height: iconSize,
        src: 'icons/dot.svg',
        width: iconSize
      })
    }),
    overlayStroke
  ]
}
