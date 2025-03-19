package fr.gouv.cacem.monitorenv.domain.use_cases.departmentArea

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.departmentArea.DepartmentAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreaRepository
import org.slf4j.LoggerFactory

@UseCase
class GetDepartmentAreaByInseeCode(
    private val departmentAreaRepository: IDepartmentAreaRepository,
) {
    private val logger = LoggerFactory.getLogger(GetDepartmentAreaByInseeCode::class.java)

    fun execute(departmentAreaInseeCode: String): DepartmentAreaEntity {
        logger.info("GET department area from insee code $departmentAreaInseeCode")
        return departmentAreaRepository.findByInseeCode(departmentAreaInseeCode)
    }
}
