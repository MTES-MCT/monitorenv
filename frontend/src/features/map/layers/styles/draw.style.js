import MultiPoint from 'ol/geom/MultiPoint'
import { Icon, Style } from 'ol/style'
import Circle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'

import { COLORS } from '../../../../constants/constants'
import { olGeometryTypes } from '../../../../domain/entities/drawLayer'

export const drawStyle = new Style({
  fill: new Fill({
    color: 'rgb(255, 255, 255, 0.3)'
  }),
  image: new Icon({
    opacity: 1,
    scale: 1.5,
    src: 'Pointeur_selection_zone.svg'
  }),
  stroke: new Stroke({
    color: COLORS.slateGray,
    lineDash: [5, 5]
  })
})

export const editStyle = new Style({
  geometry(feature) {
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
  image: new Circle({
    fill: new Fill({
      color: COLORS.charcoal
    }),
    radius: 5
  })
})
