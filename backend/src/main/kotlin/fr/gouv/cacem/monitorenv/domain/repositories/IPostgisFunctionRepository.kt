package fr.gouv.cacem.monitorenv.domain.repositories

import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.geom.MultiPolygon

interface IPostgisFunctionRepository {
    fun normalizeMultipolygon(geometry: MultiPolygon): MultiPolygon
    fun normalizeGeometry(geometry: Geometry): Geometry
}
