import { overlayStroke } from '@features/map/overlays/style'
import { RecentActivity } from '@features/RecentActivity/types'
import { THEME } from '@mtes-mct/monitor-ui'
import { Layers } from 'domain/entities/layers/constants'
import { Icon, Stroke, Style } from 'ol/style'

const getIconColor = (ratioInfractionsInControls: number) => {
  if (ratioInfractionsInControls < 6) {
    return RecentActivity.CONTROLS_COLORS[0]
  }
  if (ratioInfractionsInControls < 11) {
    return RecentActivity.CONTROLS_COLORS[1]
  }
  if (ratioInfractionsInControls < 26) {
    return RecentActivity.CONTROLS_COLORS[2]
  }
  if (ratioInfractionsInControls < 51) {
    return RecentActivity.CONTROLS_COLORS[3]
  }
  if (ratioInfractionsInControls < 76) {
    return RecentActivity.CONTROLS_COLORS[4]
  }
  if (ratioInfractionsInControls < 91) {
    return RecentActivity.CONTROLS_COLORS[5]
  }

  return RecentActivity.CONTROLS_COLORS[6]
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
