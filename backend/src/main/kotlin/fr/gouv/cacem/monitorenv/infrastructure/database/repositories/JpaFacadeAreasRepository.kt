package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBFacadeAreasRepository
import org.locationtech.jts.geom.Geometry
import org.springframework.stereotype.Repository

@Repository
class JpaFacadeAreasRepository(
    private val dbFacadeAreasRepository: IDBFacadeAreasRepository,
) : IFacadeAreasRepository {
    override fun findFacadeFromGeometry(geometry: Geometry): String? =
        dbFacadeAreasRepository.findFacadeFromGeometry(geometry)
}
