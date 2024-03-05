package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.repositories.IPostgisFunctionRepository
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.geom.Point
import org.springframework.stereotype.Repository

@Repository
class JpaPostgisFunctionRepository : IPostgisFunctionRepository {
    @PersistenceContext
    private lateinit var entityManager: EntityManager

    override fun normalizeMultipolygon(geometry: MultiPolygon): MultiPolygon {
        return entityManager.createNativeQuery(
            """
         SELECT CASE
            WHEN st_xmax(:geom)> 230 OR st_xmin(:geom)<-205
                THEN CAST(CAST(:geom AS geography) AS geometry)
            ELSE :geom END
            """.trimIndent(),
            MultiPolygon::class.java,
        )
            .setParameter("geom", geometry)
            .singleResult as MultiPolygon
    }

    override fun normalizeGeometry(geometry: Geometry): Geometry {
        return entityManager.createNativeQuery(
            """
         SELECT CASE
            WHEN st_xmax(:geom)> 230 OR st_xmin(:geom)<-205
                THEN CAST(CAST(:geom AS geography) AS geometry)
            ELSE :geom END
            """.trimIndent(),
            Geometry::class.java,
        )
            .setParameter("geom", geometry)
            .singleResult as Point
    }
}
