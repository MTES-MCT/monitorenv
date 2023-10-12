package fr.gouv.cacem.monitorenv.domain.use_cases.departmentArea

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.departmentArea.DepartmentAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IDepartmentAreaRepository

@UseCase
class GetDepartmentAreaByInseeCode(private val departmentAreaRepository: IDepartmentAreaRepository) {
    fun execute(departmentAreaInseeCode: String): DepartmentAreaEntity {
        return departmentAreaRepository.findByInseeCode(departmentAreaInseeCode)
    }
}
