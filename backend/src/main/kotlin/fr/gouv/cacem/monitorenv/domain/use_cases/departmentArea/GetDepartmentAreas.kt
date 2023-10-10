package fr.gouv.cacem.monitorenv.domain.use_cases.departmentArea

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.departmentArea.DepartmentAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreaRepository
import org.slf4j.LoggerFactory

@UseCase
class GetDepartmentAreas(private val departmentAreaRepository: IDepartmentAreaRepository) {
    private val logger = LoggerFactory.getLogger(GetDepartmentAreas::class.java)

    fun execute(): List<DepartmentAreaEntity> {
        val departmentAreas = departmentAreaRepository.findAll()

        logger.info("Found ${departmentAreas.size} departmentAreas.")

        return departmentAreas
    }
}
