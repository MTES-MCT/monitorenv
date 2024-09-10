package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.RegulatoryAreaModel
import org.locationtech.jts.geom.Geometry
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface IDBRegulatoryAreaRepository : JpaRepository<RegulatoryAreaModel, Int> {
    @Query(
        value =
        """
            SELECT * FROM regulations_cacem
            WHERE ST_INTERSECTS(st_setsrid(geom, 4326), st_setsrid(:geometry, 4326))
        """,
        nativeQuery = true,
    )
    fun findAllByGeom(geometry: Geometry): List<RegulatoryAreaModel>
}
