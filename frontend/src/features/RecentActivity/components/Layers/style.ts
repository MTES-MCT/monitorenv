import { overlayStroke } from '@features/map/overlays/style'
import { RecentActivity } from '@features/RecentActivity/types'
import { THEME } from '@mtes-mct/monitor-ui'
import { Layers } from 'domain/entities/layers/constants'
import { Icon, Stroke, Style } from 'ol/style'

const getIconColor = (ratioInfractionsInControls: number) =>
  RecentActivity.CONTROL_THRESHOLDS.find(({ limit }) => ratioInfractionsInControls < limit)?.color

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
