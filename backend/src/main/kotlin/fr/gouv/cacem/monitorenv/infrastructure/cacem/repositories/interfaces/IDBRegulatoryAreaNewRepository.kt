package fr.gouv.cacem.monitorenv.infrastructure.cacem.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.cacem.model.RegulatoryAreaNewModel
import org.locationtech.jts.geom.Geometry
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface IDBRegulatoryAreaNewRepository : JpaRepository<RegulatoryAreaNewModel, Int> {
    @Query(
        value =
            """
            SELECT r.id FROM RegulatoryAreaModel r
            WHERE ST_INTERSECTS(st_setsrid(r.geom, 4326), ST_Buffer(st_setsrid(:geometry, 4326), 0))
        """,
    )
    fun findAllIdsByGeom(geometry: Geometry): List<Int>

    fun findAllByOrderByLayerName(): List<RegulatoryAreaNewModel>
}
