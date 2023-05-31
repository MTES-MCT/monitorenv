package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreasRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBDepartmentAreasRepository
import org.locationtech.jts.geom.Geometry
import org.springframework.stereotype.Repository

@Repository
class JpaDepartmentAreasRepository(private val dbDepartmentAreasRepository: IDBDepartmentAreasRepository) :
    IDepartmentAreasRepository {

    override fun findDepartmentFromGeometry(geometry: Geometry): String? {
        return dbDepartmentAreasRepository.findDepartmentFromGeometry(geometry)
    }
}
