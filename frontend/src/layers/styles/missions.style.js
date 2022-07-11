import { Icon, Style } from 'ol/style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'

import { COLORS } from '../../constants/constants'

export const missionCentroidStyle = new Style({
  image: new Icon({
    src: 'marker-flag.svg',
    color: COLORS.missingGreen,
    offset: [0, 0],
    imgSize: [30, 79]
  })
})

export const missionZoneStyle = new Style({
  image: new Icon({
    opacity: 1,
    src: 'Pointeur_selection_zone.svg',
    scale: 1.5
  }),
  stroke: new Stroke({
    color: COLORS.shadowBlue,
  }),
  fill: new Fill({
    color: 'rgba(107,131,158, .2)'
  })

})