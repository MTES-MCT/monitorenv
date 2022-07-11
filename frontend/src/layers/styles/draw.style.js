import { Icon, Style } from 'ol/style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import Circle from 'ol/style/Circle'
import MultiPoint from 'ol/geom/MultiPoint'

import { olGeometryTypes } from '../../../src/domain/entities/drawLayer'

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
    const geometryType = feature.getGeometry()?.getType()
    switch (geometryType) {
      case olGeometryTypes.POINT:
      case olGeometryTypes.MULTIPOINT:    
        return new MultiPoint(feature.getGeometry().getCoordinates())
      case olGeometryTypes.POLYGON:
      case olGeometryTypes.MULTIPOLYGON:
      default:
        // return the coordinates of the first ring of the polygon
        return new MultiPoint(feature.getGeometry().getCoordinates()[0])
    }
  },
})