package fr.gouv.cacem.monitorenv.utils

import org.locationtech.jts.geom.Coordinate
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.geom.GeometryFactory
import org.locationtech.jts.geom.PrecisionModel

class GeometryUtils {
    companion object {
        fun extentToPolygon(extent: List<Double>): Geometry {
            val minX = extent[0]
            val minY = extent[1]
            val maxX = extent[2]
            val maxY = extent[3]

            val gf = GeometryFactory(PrecisionModel(), 4326)

            val coords: Array<Coordinate?> =
                arrayOf(
                    Coordinate(minX, minY),
                    Coordinate(maxX, minY),
                    Coordinate(maxX, maxY),
                    Coordinate(minX, maxY),
                    Coordinate(minX, minY),
                )

            return gf.createPolygon(coords)
        }
    }
}
