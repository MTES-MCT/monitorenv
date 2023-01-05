import MultiPoint from 'ol/geom/MultiPoint'
import { Icon, Style } from 'ol/style'
import Circle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'

import { COLORS } from '../../../../constants/constants'
import { OLGeometryType } from '../../../../domain/entities/map/constants'

import type { MultiPolygon } from 'ol/geom'

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
  geometry: feature => {
    if (!feature.getGeometry()) {
      return undefined
    }

    const geometryType = feature.getGeometry()?.getType()
    switch (geometryType) {
      case OLGeometryType.POINT:
      case OLGeometryType.MULTIPOINT:
        return new MultiPoint((feature.getGeometry() as MultiPoint).getCoordinates())
      case OLGeometryType.POLYGON:
      case OLGeometryType.MULTIPOLYGON:
      default: {
        const coordinates = (feature.getGeometry() as MultiPolygon).getCoordinates()
        const points = coordinates.reduce((accumulator, polygon) => {
          const firstPolygonRing = polygon[0]
          if (firstPolygonRing) {
            return accumulator.concat(firstPolygonRing)
          }

          return accumulator
        }, [])

        if (!coordinates) {
          return undefined
        }

        // @ts-ignore
        return new MultiPoint(points)
      }
    }
  },
  image: new Circle({
    fill: new Fill({
      color: COLORS.charcoal
    }),
    radius: 5
  })
})
