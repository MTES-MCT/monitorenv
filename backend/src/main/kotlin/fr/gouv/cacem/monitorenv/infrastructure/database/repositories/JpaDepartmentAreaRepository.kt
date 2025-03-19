package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.departmentArea.DepartmentAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreaRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBDepartmentAreaRepository
import org.locationtech.jts.geom.Geometry
import org.springframework.stereotype.Repository

@Repository
class JpaDepartmentAreaRepository(
    private val dbDepartmentAreasRepository: IDBDepartmentAreaRepository,
) : IDepartmentAreaRepository {
    override fun findAll(): List<DepartmentAreaEntity> =
        dbDepartmentAreasRepository.findAll().map { it.toDepartmentArea() }

    override fun findByInseeCode(inseeCode: String): DepartmentAreaEntity =
        dbDepartmentAreasRepository.findByInseeCode(inseeCode).toDepartmentArea()

    override fun findDepartmentFromGeometry(geometry: Geometry): String? =
        dbDepartmentAreasRepository.findDepartmentFromGeometry(geometry)
}
