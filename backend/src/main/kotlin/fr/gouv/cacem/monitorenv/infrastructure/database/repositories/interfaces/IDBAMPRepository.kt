package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.AMPModel
import org.locationtech.jts.geom.Geometry
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface IDBAMPRepository : JpaRepository<AMPModel, Int> {
    @Query(
        value =
        """

        SELECT * FROM amp_cacem
        WHERE ST_INTERSECTS(st_setsrid(geom, 4326), st_setsrid(:geometry, 4326))
        """,
        nativeQuery = true,
    )
    fun findAllByGeom(geometry: Geometry): List<AMPModel>
}
