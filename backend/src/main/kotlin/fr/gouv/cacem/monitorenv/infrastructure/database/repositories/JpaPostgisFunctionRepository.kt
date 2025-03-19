package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.repositories.IPostgisFunctionRepository
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.geom.MultiPolygon
import org.springframework.stereotype.Repository

@Repository
class JpaPostgisFunctionRepository : IPostgisFunctionRepository {
    @PersistenceContext
    private lateinit var entityManager: EntityManager

    override fun normalizeMultipolygon(geometry: MultiPolygon): MultiPolygon =
        entityManager
            .createNativeQuery(
                """
                SELECT CASE
                   WHEN st_xmax(:geom)> $MAXIMUM_EASTBOUND OR st_xmin(:geom)< $MINIMUM_WESTBOUND
                       THEN CAST(CAST(:geom AS geography) AS geometry)
                   ELSE :geom END
                """.trimIndent(),
                MultiPolygon::class.java,
            ).setParameter("geom", geometry)
            .singleResult as MultiPolygon

    override fun normalizeGeometry(geometry: Geometry): Geometry =
        entityManager
            .createNativeQuery(
                """
                SELECT CASE
                   WHEN st_xmax(:geom)> $MAXIMUM_EASTBOUND OR st_xmin(:geom)< $MINIMUM_WESTBOUND
                       THEN CAST(CAST(:geom AS geography) AS geometry)
                   ELSE :geom END
                """.trimIndent(),
                Geometry::class.java,
            ).setParameter("geom", geometry)
            .singleResult as Geometry

    companion object {
        // Allow a geometry to cross the date line
        // minimum westbound is near the australian coastline when reaching the area panning from france to the west
        private const val MINIMUM_WESTBOUND = -205

        // maximum eastbound is further east of the French Polynesia Archipelago panning from france to the east
        private const val MAXIMUM_EASTBOUND = 230
    }
}
