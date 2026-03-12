package fr.gouv.cacem.monitorenv.domain.use_cases.amp.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader

class AmpFixture {
    companion object {
        fun anAmp(
            id: Int = 1,
            geom: MultiPolygon? = null,
        ): AMPEntity {
            val wktReader = WKTReader()
            val multipolygonString =
                "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
            val polygon = wktReader.read(multipolygonString) as MultiPolygon

            val geometry = geom ?: polygon
            println("Created AMP with id: $id and geometry: $geometry")
            return AMPEntity(id = id, designation = "designation", name = "amp", geom = geometry)
        }
    }
}
