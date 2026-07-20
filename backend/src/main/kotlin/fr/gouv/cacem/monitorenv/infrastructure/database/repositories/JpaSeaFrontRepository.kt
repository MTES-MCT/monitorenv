package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.seafront.SeaFrontEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ISeaFrontRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBFacadeAreasRepository
import org.locationtech.jts.geom.Geometry
import org.springframework.stereotype.Repository

@Repository
class JpaSeaFrontRepository(
    private val dbFacadeAreasRepository: IDBFacadeAreasRepository,
) : ISeaFrontRepository {
    override fun findSeaFrontFromGeometry(geometry: Geometry): String? =
        dbFacadeAreasRepository.findFacadeFromGeometry(geometry)

    override fun findAll(): List<SeaFrontEntity> = dbFacadeAreasRepository.findAll().map { it.toFacadeEntity() }
}
