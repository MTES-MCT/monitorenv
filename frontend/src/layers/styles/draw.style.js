import { Icon, Style } from 'ol/style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import Circle from 'ol/style/Circle'
import MultiPoint from 'ol/geom/MultiPoint';

import { COLORS } from '../../constants/constants'

export const drawStyle = new Style({
  image: new Icon({
    opacity: 1,
    src: 'Pointeur_selection_zone.svg',
    scale: 1.5
  }),
  stroke: new Stroke({
    color: COLORS.slateGray,
    lineDash: [5, 5]
  }),
  fill: new Fill({
    color: 'rgb(255, 255, 255, 0.3)'
  })

})

export const editStyle = new Style({
  image: new Circle({
    radius: 5,
    fill: new Fill({
      color: COLORS.charcoal,
    }),
  }),
  geometry: function (feature) {
    // return the coordinates of the first ring of the polygon
    const coordinates = feature.getGeometry().getCoordinates()[0];
    return new MultiPoint(coordinates);
  },
})